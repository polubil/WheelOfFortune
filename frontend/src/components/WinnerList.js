import React, { Component, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap';
import { Wheel } from 'react-custom-roulette'

function WinnerListElement(props) {
  return (
    <>
    <div className="list-element align-items-center align-content-center d-flex justify-content-between px-2">
      <span className='winner-list-text-elem'>
        <svg height="50" width="50">
          <circle cx="25" cy="25" r="20" stroke="black" strokeWidth="3" fill="grey" />
          Sorry, your browser does not support inline SVG.  
        </svg> 
      </span>
      <span className='winner-list-text-elem'>{props.username}</span>
      <span className='winner-list-text-elem'>{props.winning_amount}<img className='coins_img' src="../static/frontend/images/coins1.svg" alt="coins" width="50px" height="30px"></img></span>
      <span className='winner-list-text-elem'>{Math.ceil((Date.now()-Date.parse(props.win_date))/1000)} с.</span>
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
      placeholder: "Loading"
    };
  }

  componentDidUpdate() {
    if (!(this.state.data == this.props.winnersList)) {
      this.setState({
        data: this.props.winnersList,
      })
    }

  }


  render() {
    return (
      <>
      <div className="winners-container m-2 p-2">
        <span className='winners-title my-3'>WINNERS</span>
        {this.state.data.map(winner => {
          return (
            <WinnerListElement key={winner.id} username={winner.winner} winning_amount={winner.winning_amount} win_date={winner.win_date}/>
          );
        })}
      </div>
      </>
    );
  }
}


function Button(props) {
  if (props.title_second_line) {
    return (
      <>
        <button className='d-inline-flex p-1 flex-column button-group-element' onClick={props.onClick}>
          <span className='info-group-text p-2'>{props.title_first_line}</span> 
          <span className='info-group-text p-2'>{props.title_second_line}</span> 
        </button>
      </>
    )
  } else {
    return (
      <>
        <button className='d-inline-flex p-1 flex-column button-group-element' onClick={props.onClick}>
          <span className='info-group-text mx-3 fs-2 my-2'>{props.title_first_line}</span> 
        </button>
      </>
    )
  }
}

function Jackpot(props) {
  return (
    <>
      <div className='d-inline-flex p-1 flex-column info-group-element'>
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
  `)

  return (
      <>
        <style>{Style}</style>
        <div className='align-items-center flex-column justify-content-center text-center myLayout'>
          <span className='winner-text my-2'>{props.firstText}</span>
            {props.layoutImage == true && <span className='winner-text my-2'>{props.secondText}
              <img className='coins_img' src="../static/frontend/images/coins1.svg" alt="coins" width="100px" height="65px"></img>
            </span>}
          <Button title_first_line="GREAT" onClick={props.hideLayout}/>
        </div>
      </>
    )      
}

function Balance(props) {
  return (
    <>
      <div className='d-inline-flex p-1 flex-column info-group-element'>
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
          <Button title_first_line="SPIN" title_second_line="WHEEL" onClick={this.props.onClick}/>
          <Layout layoutImage={this.state.layoutImage} firstText={this.state.layoutFirstText} secondText={this.state.layoutSecondText}  hideLayout={this.props.hideLayout} layout={this.state.layout}/>
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
    }
    this.handleStopSpinning = this.handleStopSpinning.bind(this)
  }

  async getPrizes() {
    let obj;
    const res = await fetch('http://127.0.0.1:8000/API/Prizes')
    obj = await res.json();
    let data = []

    for (let i in obj) {
      if (i % 2 == 0) {
        data.push({ option: obj[i], style: { backgroundColor: "#f2af05", textColor: '#ffffff' }});
      } else {
        data.push({ option: obj[i], style: { backgroundColor: "#32312f", textColor: '#ffffff' } });
      }
    }

    this.setState({
      prizes: data,
    })
  }

  componentDidMount() {
    this.getPrizes()
  }

  componentDidUpdate() {
    if (!this.props.mustSpin == this.state.mustSpin) {
      this.setState({
        mustSpin: this.props.mustSpin
      })
    }
    if (!(this.props.prizeIndex == this.state.prizeIndex)) {
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
        <div className='my-container flex-grow-1 m-2'>
          <Wheel
            radiusLineWidth = {0}
            textDistance = {80}
            outerBorderColor = "#bfbebd"
            outerBorderWidth = {20}
            fontFamily = "Luckiest Guy"
            fontSize = {40}
            perpendicularText = {true}
            spinDuration = {0.02}
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
    };
    this.handleClick = this.handleClick.bind(this)
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
    if (!(this.state.balance == this.props.balance) && (this.state.balance == 0) && this.state.responseBalance == null){
      this.setState({
        balance: this.props.balance,
      })
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
          prizeIndex: response["prize_index"],
          prize: response["result"],
          responseBalance: response["user_balance"],
        })
        this.setLayoutText(response["result"])
      });
  }

  startWheelSpin() {
    if (this.state.prize >= 0) {
      this.setState({mustSpin: true,})
    }
  }

  setLayoutText(prize) {
    if (prize == 0) {
      this.setState({
        layoutFirstText: "YOU WON NOTHING, TRY AGAIN!",
        layoutImage: false,
      })
    }
    else if (prize == -1) {
      this.setState({
        layoutFirstText: "YOU HAVE NOT ENOUGTH MONEY!",
        layout: true,
        layoutImage: false,
      }) 
    }
    else if (prize > 0) {
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
    })
    this.props.updateWinners()
  }

  hideLayout() {
    this.setState({
      layout: false,
    })
  }
  
  render() {
    return (
      <>
        <span className='main-title my-2 fs-1'>
          WHEEL OF FORTUNE
        </span>
        <div className='d-flex flex-column h-25 justify-content-between'>
          <WheelContainer startWheelSpin={this.startWheelSpin} prizeIndex={this.state.prizeIndex} onSpinningEnd={this.handleStopSpinning} mustSpin={this.state.mustSpin}/>
          <InfoGroup 
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
      loaded: false,
      placeholder: "Loading",
      balance: 0,
      username: "",
    };
    this.getLastWinners = this.getLastWinners.bind(this)
  }

  async getUserBalance() {
    let obj;
    const res = await fetch('http://127.0.0.1:8000/API/UserBalance?format=json')
    obj = await res.json();
    this.setState({
      balance: obj['user_balance'],
      username: obj['username'],
    })
    console.log(obj['user_balance'])
  }

  async getLastWinners() {
    let obj;
    const res = await fetch('http://127.0.0.1:8000/API/Last20Winners?format=json')
    obj = await res.json();
    this.setState({
      winnersList: obj,
    })
    console.log("Last winner request")
  }

  componentDidMount() {
    this.getUserBalance()
    this.getLastWinners()
  }; 


  render() {
    return (
      <>
        <div className='p-1 mw-50 app-container container-sm d-flex flex-column justify-content-center text-center h-100'>
          <GameContainer updateWinners={this.getLastWinners} prizer={[1, 2, 3, 4, 5, 6]} balance={this.state.balance}/>
          <WinnerList winnersList={this.state.winnersList} />        
        </div>
      </>
    )
  }
}

export default App;

const container = document.getElementById("winners-list");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home"/>);