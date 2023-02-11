import React, { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';

function AuthForm() {

  const [justifyActive, setJustifyActive] = useState('tab1');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');

  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  
  const [result, setResult] = useState("")
  const [isErrorLogin, setErrorLogin] = useState(false)
  const [isErrorReg, setErrorReg] = useState(false)


  const getCookie = function (name) {
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


  const handleClick = async () => {
    let csrftoken = getCookie('csrftoken')
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ username: login, password: password })
    };
    console.log(login, password)
    fetch('/API/Login', requestOptions)
      .then(response => response.json())
      .then(response => {
        if (response["message"] == "Success!") {
          window.location.reload(false);
        } else {
          setErrorLogin(true)
        }
      });
  }

  const handleSignUp = async () => {
    let csrftoken = getCookie('csrftoken')
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ username: username, password1: password1, password2: password2 })
    };
    fetch('/API/SignUp', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response["messages"])
        if (response["messages"].length == 0) {
          window.location.reload(false);
        } else {
          setErrorReg(true)
        }
      });
  }

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  return (
    <div className='auth-container d-flex w-100 justify-content-center align-items-center text center'>
      <MDBContainer className="mdb-container p-3 my-5 d-flex flex-column d-flex bg-light text-dark">

        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>

          <MDBTabsPane show={justifyActive === 'tab1'}>

            <MDBInput wrapperClass='mb-4' label='Username' id='form0Field1' onChange={(e) => setLogin(e.target.value)} value={login} type='email'/>
            <MDBInput wrapperClass='mb-4' label='Password' id='form1Field2' onChange={(e) => setPassword(e.target.value)} value={password} type='password'/>
            {isErrorLogin && <div className='p-3 mb-2 bg-danger text-white'>Аккаунт не существует или данные введены неверно.</div>}
            <MDBBtn onClick={handleClick} className="mb-4">Sign in</MDBBtn>

          </MDBTabsPane>

          <MDBTabsPane show={justifyActive === 'tab2'}>

            <MDBInput wrapperClass='mb-4' label='Username' id='form1Field1' onChange={(e) => setUsername(e.target.value)} value={username} type='text'/>
            <MDBInput wrapperClass='mb-4' label='Password' id='form1Field2' onChange={(e) => setPassword1(e.target.value)} value={password1} type='password'/>
            <MDBInput wrapperClass='mb-4' label='Repeat password' id='form1Field3' onChange={(e) => setPassword2(e.target.value)} value={password2} type='password'/>
            {isErrorReg && <div className='p-3 mb-2 bg-danger text-white'>Ошибка регистрации. Проверьте правильность заполнения всех полей и попробуйте ещё раз.</div>}
            <MDBBtn onClick={handleSignUp} className="mb-4">Sign up</MDBBtn>

          </MDBTabsPane>

        </MDBTabsContent>

      </MDBContainer>      
    </div>

  );
}

export default AuthForm;