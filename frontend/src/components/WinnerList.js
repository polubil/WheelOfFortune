import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap';
import { Wheel } from 'react-custom-roulette'

function WinnerListElement(props) {
  const ListStyle = (`
  .list-element {
    background: linear-gradient(180deg, #62B5F0 0%, #046EBA 100%);
    box-shadow: 1px 3px 3px rgba(16, 46, 131, 0.5);
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
  }
  `)

  return (
    <>
    <style>
      {ListStyle}
    </style>
    <div className="list-element">
      <span>{props.username} {props.winning_amount} {props.win_date}</span>
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

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.data == nextProps.winnersList) {
      return false
    } else {
      this.setState({
        data: nextProps.winnersList,
      })
      return true
    }
  }

  render() {
    const myStyle = (`
    .winners-container {
      background: linear-gradient(180deg, #3598DF 0%, #006BB8 100%);
      box-shadow: inset 1px 5px 4px #1B379F;
      border-radius: 15px;
    }

    .winners-title {
      font-family: 'Luckiest Guy';
      font-style: normal;
      font-weight: 400;
      font-size: 30px;
      line-height: 30px;
      /* identical to box height */

      text-align: center;

      color: #FFFFFF;

      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
    `)

    return (
      <>
      <style>
        {myStyle}
      </style>
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
  const ButtonInfoGroupElement = (`
    .button-group-element {
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      background: linear-gradient(#8B0000, #8B0000);
      box-shadow: inset 0px 2px 2px #400000;
      border-radius: 10px;
      margin: 3px;
      border: solid 3px #FFCD7E;
      text-align: center;
      line-height: 2vh;
    }
    `)

  if (props.title_second_line) {
    return (
      <>
      <style>
        {ButtonInfoGroupElement}
      </style>
      <button className='btn d-inline-flex p-1 flex-column button-group-element' onClick={props.onClick}>
        <span className='info-group-text p-2'>{props.title_first_line}</span> 
        <span className='info-group-text p-2'>{props.title_second_line}</span> 
      </button>
      </>
    )
  } else {
    return (
      <>
      <style>
        {ButtonInfoGroupElement}
      </style>
      <button className='d-inline-flex p-1 flex-column button-group-element' onClick={props.onClick}>
        <span className='info-group-text p-2'>{props.title_first_line}</span> 
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
    html {
      min-height:100%;/* make sure it is at least as tall as the viewport */
      position:relative;
    }
    body {
      height:100%; /* force the BODY element to match the height of the HTML element */
    }
    .myLayout {
      overflow:hidden;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.8);
      min-width: 100%;
      min-height: 100%;
      display: ${props.layout ? "flex" : "none" };
      top:0;
      bottom:0;
      left:0;
      right:0
    }

    .winner-text {
      font-family: 'Luckiest Guy';
      font-style: normal;
      font-weight: 400;
      font-size: 60px;
      line-height: 60px;
      text-align: center;
      color: #FFFFFF;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
  `)

  return (
    <>
    <style>
      {Style}
    </style>
    <div className='align-items-center flex-column justify-content-center text-center myLayout'>
      <span className='winner-text'>{props.text}</span>
      <Button title_first_line="GREAT" onClick={props.hideLayout}/>
    </div>
    </>
  )
}

function Balance(props) {
  const InfoGroupElement = (`
    .info-group-element {
      box-sizing: border-box;
      background: linear-gradient(327.68deg, #588DD8 -2.66%, #324FA5 80.63%);
      box-shadow: inset 0px 2px 2px #400000;
      border-radius: 10px;
      margin: 3px;
      border: solid 3px #FFCD7E;
      text-align: center;
    }
    .info-group-text {
      font-family: 'Luckiest Guy';
      font-weight: 400;
      font-size: 2.5vh;
      line-height: .7vh;
      text-align: center;
      letter-spacing: 1px;
      color: #FAC269;
      text-shadow: -1px -1px 0px #B46E00;
      vertical-align: middle;
      padding: 10px 0;
    }
  `)

  return (
    <>
    <style>
      {InfoGroupElement}
    </style>
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
      layoutText: props.layoutText,
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
    if (!(this.state.layoutText == this.props.layoutText)) {
      this.setState({
        layoutText: this.props.layoutText
      })
      console.log("layouttext sended to state")
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
    const infoGroupStyle = (`
    
    `)

    return (
      <>
      <style>
        {infoGroupStyle}
      </style>
      <div className='d-flex flex-shrink-1 end-0 m-2 flex-column content-beetwen info-group'>
        <Balance balance={this.state.balance}/>
        <Jackpot />
        <Button title_first_line="SPIN" title_second_line="WHEEL" onClick={this.props.onClick}/>
        <Layout text={this.state.layoutText} hideLayout={this.props.hideLayout} layout={this.state.layout}/>
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
    console.log(obj)
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
    const myStyle = (`
    .my-container {
      position: relative;
      display: inline-flex;
      aspect-ratio: 1 / 1;
      text-align: center;
      max-height: 50vh;
      max-width: 50vh;
      background: linear-gradient(180deg, #3496DF 11.29%, #016CB9 94.98%);
      box-shadow: inset 1px 5px 4px #1B379F;
      border-radius: 15px;
      justify-content: center;
      align-items: center;
      }
    .bhdLno {
      z-index: 0 !important;
      width: 92% !important;
      height: 92% !important;
      top: 0.4vh;
      transform: rotate(-45deg);
    }
    img[alt~="roulette-static"] {
      position: relative;
      z-index: 1;
      width: 7%;
      right: -30%;
      top: 13%;
      transform: rotate(45deg);
      content: url("../static/frontend/images/wheel-pointer 1.svg"); }
    `)
    
    return (
      <>
        <style>
          {myStyle}
        </style>
        <div className='my-container flex-grow-1 m-2'>
          <Wheel
            radiusLineWidth = {0}
            pointerProps = {{src: "../static/frontend/images/wheel-pointer 1.svg"}}
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
      layoutText: null,
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
    if (!(this.state.balance == this.props.balance)){
      this.setState({
        balance: this.props.balance,
      })
    }
  }

  shouldComponentUpdate() {
    return !(this.state.balance == this.state.responseBalance)
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
        console.log(response)
        this.setState({
          prizeIndex: response["prize_index"],
          prize: response["result"],
          responseBalance: response["user_balance"],
        })
        this.setLayoutText(response["result"])
      });
  }

  startWheelSpin() {
    this.setState({mustSpin: true,})
  }

  setLayoutText(prize) {
    console.log(prize)
    console.log(this.state.prize)
    if (prize == 0) {
      this.setState({
        layoutText: "YOU WON NOTHING, TRY AGAIN!",
      })
    }
    else if (prize == -1) {
      this.setState({
        layoutText: "YOU HAVE NOPT ENOUGTH MONEY!",
      }) 
    }
    else if (prize > 0) {
      this.setState({
        layoutText: `YOU WON ${prize}`,
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
    })
  }

  hideLayout() {
    this.setState({
      layout: false,
    })
  }
  
  render() {
    const myStyle = (`
      .main-title {
        top: 5vh;
        font-family: 'Luckiest Guy';
        font-weight: 400;
        line-height: 4vh;
        text-align: center;
        letter-spacing: 1px;
        color: #FFFFFF;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }
    `)
    console.log(this.state.mustSpin)
    return (
      <>
      <style>{myStyle}</style>
      <span className='main-title my-2 fs-1'>
        WHEEL OF FORTUNE
      </span>
      <div className='d-flex flex-row h-25 justify-content-between'>
        <WheelContainer startWheelSpin={this.startWheelSpin} prizeIndex={this.state.prizeIndex} onSpinningEnd={this.handleStopSpinning} mustSpin={this.state.mustSpin}/>
        <InfoGroup hideLayout={this.hideLayout} layoutText={this.state.layoutText} layout={this.state.layout} onClick={this.handleClick} balance={this.state.balance}/>
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
    console.log(obj)
  }

  componentDidMount() {
    this.getUserBalance()
    this.getLastWinners()
  }; 


  render() {
    const myStyle = (`
    .app-container {
      background: radial-gradient(85.48% 79.62% at 50% 50%, #75BDFF 0%, #020065 100%);
    }
    `)

    return (
      <>
      <style>
        {myStyle}
      </style>
      <div className='p-1 mw-50 app-container container-sm d-flex flex-column justify-content-center text-center h-100'>
        <GameContainer prizer={[1, 2, 3, 4, 5, 6]} balance={this.state.balance}/>
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