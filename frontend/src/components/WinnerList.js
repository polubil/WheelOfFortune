import React, { Component, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap';
import { Wheel } from 'react-custom-roulette'
import AuthForm from './AuthForm';
import axios from 'axios';



function WinnerListElement(props) {

  let user_picture = `../static/frontend/images/pictures/${props.username}.svg`
  let default_picture = `../static/frontend/images/pictures/default.svg`

  return (
    <>
    <div className="list-element align-items-center p-2 align-content-center d-flex justify-content-between align-self-stretch px-2 m-2">
      <div>
        { 1 == 2 &&
          <span className='winner-list-text-elem'>
          <svg height="50" width="50">
            <circle cx="25" cy="25" r="20" stroke="black" strokeWidth="3" fill="grey" />
            Sorry, your browser does not support inline SVG.  
          </svg> 
          </span>        
        }
        <span className='winner-list-text-elem'>
          <img className='user-picture' src={user_picture} onError={(event)=>event.target.setAttribute("src",default_picture)}></img>
        </span> 
      </div>
      <div className='username-cont' style={{width: 35 + "%"}}>
        <span className='winner-list-text-elem text-wrap'>{props.user_str}</span>
      </div>
      <div style={{width: 35 + "%"}}>
        <span className='winner-list-text-elem'>{props.winning_amount} <img className='coins_img' src="../static/frontend/images/coins1.svg" alt="coins" width="40px" height="25px"></img></span>
      </div>
      <div style={{width: 20 + "%"}}>
        {0 <= Math.ceil((Date.now()-Date.parse(props.win_date))/1000) & Math.ceil((Date.now()-Date.parse(props.win_date))/1000) < 60 ?
          <span className='winner-list-text-elem'>{Math.ceil((Date.now()-Date.parse(props.win_date))/1000)} s.</span> : ""
        }
        {60 <= Math.ceil((Date.now()-Date.parse(props.win_date))/1000) & Math.ceil((Date.now()-Date.parse(props.win_date))/1000) < 3600 ?
          <span className='winner-list-text-elem'>{Math.ceil(((Date.now()-Date.parse(props.win_date))/1000)/60)} m.</span> : ""
        }
        {3600 <= Math.ceil((Date.now()-Date.parse(props.win_date))/1000) & Math.ceil((Date.now()-Date.parse(props.win_date))/1000) < 86400 ?
          <span className='winner-list-text-elem'>{Math.ceil((((Date.now()-Date.parse(props.win_date))/1000)/60)/60)} h.</span> : ""
        }
        {86400 <= Math.ceil((Date.now()-Date.parse(props.win_date))/1000) & Math.ceil((Date.now()-Date.parse(props.win_date))/1000) < 2419200 ?
          <span className='winner-list-text-elem'>{Math.ceil((((Date.now()-Date.parse(props.win_date))/1000)/60)/60)} d.</span> : ""
        }
      </div>
    </div>
    </>
  )
}

class WinnerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading",
      elementsCount: 4,
      containerSize: [],
      listSize: [],
      emptySize: [],
      titleSize: [],
      wheelWidth: null,
    };
    this.containerRef = React.createRef();
    this.listRef = React.createRef();
    this.titleRef = React.createRef();
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }

  componentDidUpdate() {
    if (this.state.wheelWidth != this.props.wheelWidth) {
      this.setState({
        wheelWidth: this.props.wheelWidth,
      })
    }

    if (this.state.data != this.props.winnersList) {
      this.setState({
        data: this.props.winnersList
      })
      console.log(this.state.data)
    }

    if (this.props.wheelWidth != this.state.wheelWidth) {
      this.setState({
        wheelWidth: this.props.wheelWidth
      })
    }

    if (this.state.wheelWidth > 0) {
      if ((Math.floor(this.state.wheelWidth / 95) < 8) && (Math.floor(this.state.wheelWidth / 95) != this.state.elementsCount )) {
        this.setState({
          elementsCount: Math.floor(this.state.wheelWidth / 95),
        })
      }
      if ((Math.floor(this.state.wheelWidth / 95) > 7) && (this.state.elementsCount != 7 )) {
        this.setState({
          elementsCount: 7,
        })
      }
    }
  }


  render() {
    return (
      <>
      <div ref={this.containerRef} className="winners-container m-2 p-2" style={{minWidth: 32 + "vw"}}>
        <div className='py-3'>
          <span ref={this.titleRef} className='winners-title'>WINNERS</span>
        </div>
        <div className='d-flex flex-column' ref={this.listRef}>
          {this.state.data.slice(0, this.state.elementsCount).map(data => {
            return (
              <WinnerListElement 
                key={data.id}
                username={data.winner.user.username}
                user_str={data.winner.user.first_name + " " + data.winner.user.last_name} 
                winning_amount={data.winning_amount} 
                win_date={data.win_date}
              />
            );
          })}
        </div>
      </div>
      </>
    );
  }
}


function Button(props) {
  const buttonDisabled = props.buttonDisabled

  if (buttonDisabled) {
    return (
      <>
        <button className='d-inline-flex p-1 flex-column button-group-element' disabled onClick={props.onClick}>
          <span className='info-group-text p-2'>{props.title_first_line}</span> 
          {props.title_second_line && <span className='info-group-text p-2'>{props.title_second_line}</span>} 
        </button>
      </>
    )
  } else {
    return (
      <>
        <button className='d-inline-flex p-1 flex-column button-group-element' onClick={props.onClick}>
          <span className='info-group-text p-2'>{props.title_first_line}</span> 
          {props.title_second_line && <span className='info-group-text p-2'>{props.title_second_line}</span>} 
        </button>
      </>
    )
  }
}

function Jackpot(props) {
  return (
    <>
      <div className='d-inline-flex p-1 align-items-center justify-content-center flex-column info-group-element'>
        <span className='info-group-text p-2'>JACKPOT</span>
        <span className='info-group-text p-2'>1000</span>
      </div>
    </>
  )
}

function Layout(props) {
  const Style = (`
    .myLayout {
      display: ${props.layout ? "flex" : "none" };
    }

    html {
      overflow-y: ${props.layout ? "hidden" : "overlay" };
    }
  `)

  return (
      <>
        <style>{Style}</style>
        <div className='align-items-center flex-column justify-content-center text-center myLayout'>
          <span className='winner-text my-2'>{props.firstText}</span>
            {props.layoutImage == true && <span className='winner-text my-2'>{props.secondText}
              <img className='coins_img' src="../static/frontend/images/coins1.svg" alt="coins" width="80px" height="48px"></img>
            </span>}
          <Button title_first_line="GREAT" onClick={props.hideLayout}/>
        </div>
      </>
    )      
}

function Balance(props) {
  return (
    <>
      <div className='d-inline-flex p-1 align-items-center justify-content-center flex-column info-group-element'>
        <span className='info-group-text p-2'>BALANCE</span>
        <span className='info-group-text p-2'>{props.balance}</span>
      </div>
    </>

  )
}

class InfoGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: props.balance,
      loaded: false,
      layout: false,
      layoutFirstText: props.layoutFirstText,
      layoutSecondText: props.layoutSecondText,
      layoutImage: props.layoutImage,
      buttonDisabled: props.buttonDisabled,
    },
    this.handleClickHideLayout = this.handleClickHideLayout.bind(this);
    this.setState = this.setState.bind(this);
  }


  componentDidUpdate() {
    if (!(this.state.balance == this.props.balance)) {
      this.setState({
        balance: this.props.balance
      })
    }
    if (!(this.state.layoutFirstText == this.props.layoutFirstText)) {
      this.setState({
        layoutFirstText: this.props.layoutFirstText
      })
    }
    if (!(this.state.layoutSecondText == this.props.layoutSecondText)) {
      this.setState({
        layoutSecondText: this.props.layoutSecondText
      })
    }
    if (!(this.state.layoutImage == this.props.layoutImage)) {
      this.setState({
        layoutImage: this.props.layoutImage
      })
    }
    if (!(this.state.layout == this.props.layout)) {
      this.setState({
        layout: this.props.layout
      })
    }
    if (!(this.state.buttonDisabled == this.props.buttonDisabled)) {
      this.setState({
        buttonDisabled: this.props.buttonDisabled
      })
    }
  }
  
  handleClickHideLayout() {
    this.setState({
      layout: false,
    })
  }


  render() {
    return (
      <>
        <div className='d-flex m-2 flex-row justify-content-between info-group'>
          <Balance balance={this.state.balance}/>
          <Jackpot />
          <Button buttonDisabled={this.state.buttonDisabled} title_first_line="SPIN" title_second_line="WHEEL" onClick={this.props.onClick}/>
          <Layout 
            layoutImage={this.state.layoutImage}
            firstText={this.state.layoutFirstText}        
            secondText={this.state.layoutSecondText}
            hideLayout={this.props.hideLayout} 
            layout={this.state.layout}
          />
        </div>
      </>
    )
  }
}

class WheelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mustSpin: this.props.mustSpin,
      prizes: [],
      prizeIndex: this.props.prizeIndex,
      wheelWidth: null,
    };
    this.wheelContainerRef = React.createRef();
    this.handleStopSpinning = this.handleStopSpinning.bind(this)
  }

  setWheelWidth(width) {
    this.setState({
      wheelWidth: width,
    })
    this.props.setWheelWidth(this.state.wheelWidth)
  }

  
  async getPrizes() {
    let obj;
    const res = await fetch('/API/Spinner')
    obj = await res.json();
    let data = []

    for (let i in obj) {
      if (i % 2 == 0) {
        if (obj[i] != "JACKPOT") {
          data.push({ option: obj[i], style: { backgroundColor: "#f2af05", textColor: '#ffffff' }});
        }
      } else {
        data.push({ option: obj[i], style: { backgroundColor: "#32312f", textColor: '#ffffff' }});
      }
    }

    this.setState({
      prizes: data,
    })
  }

  componentDidMount() {
    this.getPrizes()
    window.addEventListener("resize", () => this.setWheelWidth(this.wheelContainerRef.current.offsetWidth))
  }

  componentDidUpdate() {
    if (this.state.wheelWidth != this.wheelContainerRef.current.offsetWidth) {
      this.setState({
        wheelWidth: this.wheelContainerRef.current.offsetWidth,
      })
      this.props.setWheelWidth(this.state.wheelWidth)
    }

    if (this.state.wheelWidth != this.props.wheelWidth) {
      this.props.setWheelWidth(this.state.wheelWidth)
    }

    if (this.props.mustSpin != this.state.mustSpin) {
      this.setState({
        mustSpin: this.props.mustSpin
      })
    }
    if (this.props.prizeIndex != this.state.prizeIndex) {
      this.setState({
        prizeIndex: this.props.prizeIndex
      })
      this.props.startWheelSpin()
    }
  }

  handleStopSpinning() {
    this.props.onSpinningEnd()
  }

  render() {
    return (
      <>
        <div ref={this.wheelContainerRef} className='my-container flex-fill m-2'>
            <Wheel
              radiusLineWidth = {0}
              textDistance = {80}
              outerBorderColor = "#bfbebd"
              outerBorderWidth = {20}
              fontFamily = "Luckiest Guy"
              fontSize = {40}
              perpendicularText = {true}
              spinDuration = {1.0}
              onStopSpinning={this.handleStopSpinning}
              mustStartSpinning={this.state.mustSpin}
              prizeNumber={this.state.prizeIndex}
              data={this.state.prizes}
              />
        </div>
      </>
    )
  }
}

class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prizeIndex: null,
      prizeCode: null,
      balance: this.props.balance,
      mustSpin: false,
      layoutFirstText: null,
      layoutSecondText: null,
      buttonDisabled: false,
      wheelWidth: null,
    };
    this.handleClick = this.handleClick.bind(this)
    this.setWheelWidth = this.setWheelWidth.bind(this)
    this.hideLayout = this.hideLayout.bind(this)
    this.startWheelSpin = this.startWheelSpin.bind(this)
    this.handleStopSpinning = this.handleStopSpinning.bind(this)
  }
  
  getCookie(name) {
    if (!document.cookie) {
      return null;
    }
  
    const xsrfCookies = document.cookie.split(';')
      .map(c => c.trim())
      .filter(c => c.startsWith(name + '='));
  
    if (xsrfCookies.length === 0) {
      return null;
    }
    return decodeURIComponent(xsrfCookies[0].split('=')[1]);
  }


  componentDidUpdate() {
    if (this.state.balance != this.props.balance && this.state.balance == 0 && this.state.responseBalance == null){
      this.setState({
        balance: this.props.balance,
      })
    }

    if (this.state.wheelWidth != this.props.wheelWidth) {
      this.props.setWheelWidth(this.state.wheelWidth)
    }
  }

  makeSpinRequest() {
    let csrftoken = this.getCookie('csrftoken')
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ title: 'React Hooks POST Request Example' })
    };
    fetch('/API/Spinner', requestOptions)
      .then(response => response.json())
      .then(response => {
        this.setState({
          prizeIndex: response["result"],
          prize: response["response"],
          responseBalance: response["user_balance"],
        })
        this.setLayoutText(response["response"])
      });
  }

  startWheelSpin() {
    if (this.state.prize >= 0) {
      this.setState({
        mustSpin: true,
        buttonDisabled: true,
      })
    }
  }

  setLayoutText(prize) {
    if (prize == -1) {
      this.setState({
        layoutFirstText: "YOU WON NOTHING, TRY AGAIN!",
        layoutImage: false,
      })
    }
    else if (prize == -2) {
      this.setState({
        layoutFirstText: "YOU HAVE NOT ENOUGTH MONEY!",
        layout: true,
        layoutImage: false,
      }) 
    }
    else if (prize >= 0) {
      this.setState({
        layoutFirstText: `YOU WIN!`,
        layoutSecondText: `${prize}`,
        layoutImage: true,
      }) 
    }
  }

  handleClick() {
    this.makeSpinRequest()
  }
  
  handleStopSpinning() {
    this.setState({
      mustSpin: false,
      layout: true,
      balance: this.state.responseBalance,
      responseBalance: null,
      buttonDisabled: false,
    })
    this.props.updateWinners()
  }

  hideLayout() {
    this.setState({
      layout: false,
    })
  }

  setWheelWidth(width) {
    this.setState({
      wheelWidth: width,
    })
    this.props.setWheelWidth(this.state.wheelWidth)
  }
  
  render() {
    return (
      <>
        <div className='d-flex flex-column justify-content-between'>
          <WheelContainer wheelWidth={this.state.wheelWidth} setWheelWidth={this.setWheelWidth} startWheelSpin={this.startWheelSpin} prizeIndex={this.state.prizeIndex} onSpinningEnd={this.handleStopSpinning} mustSpin={this.state.mustSpin}/>
          <InfoGroup 
            buttonDisabled={this.state.buttonDisabled}
            layoutImage={this.state.layoutImage}
            hideLayout={this.hideLayout} 
            layoutFirstText={this.state.layoutFirstText} 
            layoutSecondText={this.state.layoutSecondText} 
            layout={this.state.layout} 
            onClick={this.handleClick} 
            balance={this.state.balance}/>
        </div>
      </>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winnersList: [],
      isLoaded: false,
      balance: 0,
      username: "",
      userLoggedIn: null,
      wheelWidth: null,
      loadedData: {
        balance: false,
        username: false,
        userLoggedIn: false,
        winnersList: false,
      }
    };
    this.getLastWinners = this.getLastWinners.bind(this)
    this.setWheelWidth = this.setWheelWidth.bind(this)
  }

  isLoaded() {
    const array = new Array(0)
    for (const [key, value] of Object.entries(this.state.loadedData)) {
      array.push(value)
    }
    return array.every((value) => value == true)
  }

  componentDidUpdate() {
    if (this.isLoaded() != this.state.isLoaded) {
      this.setState({isLoaded: this.isLoaded()})
      this.componentDidMount()
    }
  }

  async getUserBalance() {
    let obj;
    const res = await fetch('/API/UserBalance?format=json')
    obj = await res.json();
    let loadedDataCp = this.state.loadedData
    loadedDataCp.username = true
    loadedDataCp.balance = true
    this.setState({
      balance: obj['user_balance'],
      username: obj['username'],
      loadedData: loadedDataCp,
    })
  }

  async isUserLoggedIn() {
    let obj;
    const res = await fetch("/API/LoginChecker")
    obj = await res.json();
    let loadedDataCp = this.state.loadedData
    loadedDataCp.userLoggedIn = obj
    this.setState({
      userLoggedIn: obj,
      loadedData: loadedDataCp,
    })
    
    if (obj) {
      this.getUserBalance()
      this.getLastWinners()  
    }
  }

  async getLastWinners() {
    let obj;
    const res = await fetch('/API/Last20Winners?format=json')
    obj = await res.json();
    let loadedDataCp = this.state.loadedData
    loadedDataCp.winnersList = true
    this.setState({
      winnersList: obj,
      loadedData: loadedDataCp
    })
  }

  componentDidMount() {
    this.isUserLoggedIn()
  }; 

  setWheelWidth(width) {
    this.setState({
      wheelWidth: width,
    })
  }

  render() {    
    if (this.state.userLoggedIn) {
      if (this.state.isLoaded == true) {
        const gradiBodyStyle = (`
        body {
          background: radial-gradient(85.48% 79.62% at 50% 50%, #75BDFF 0%, #020065 100%);;
        }
      `)
        return (
          <>
            <div className="p-1 app-container d-flex flex-column justify-content-center text-center">
              <span className='main-title my-2 fs-1'>
                WHEEL OF FORTUNE!
              </span>
              <div className='p-1 app-subcontainer container-m d-flex justify-content-center'>
                <GameContainer wheelWidth={this.state.wheelWidth} setWheelWidth={this.setWheelWidth} updateWinners={this.getLastWinners} prizer={[1, 2, 3, 4, 5, 6]} balance={this.state.balance}/>
                <WinnerList wheelWidth={this.state.wheelWidth} winnersList={this.state.winnersList} />   
              </div>
            </div>
          </>
        ) 
      }
      else {
        return (
          <>
            <div className="spinner-border m-5 loading-spinner text-light" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </>
        )
      }
    }
    else {
      const whiteBodyStyle = (`
        body {
          background: rgba(251, 251, 251, var(--mdb-bg-opacity)) !important;
        }
      `)
      return (
        <>
          <style>{whiteBodyStyle}</style>
          <AuthForm></AuthForm>
        </>
      )
    }
  }
}


export default App;

const container = document.getElementById("winners-list");
const root = createRoot(container);
root.render(<App tab="home"/>);
