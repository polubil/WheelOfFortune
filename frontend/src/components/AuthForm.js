import React, { useEffect, useState } from 'react';
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
  MDBCheckbox,
  MDBTypography,
}
from 'mdb-react-ui-kit';
import LoginViaVK from './LoginViaVK';

function AuthForm() {

  const [justifyActive, setJustifyActive] = useState('tab1');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');

  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [unLenValid, setUnLenValid] = useState();
  const [unCharsValid, setUnCharsValid] = useState();
  const [pwLenValid, setPwLenValid] = useState()
  const [pwCharsValid, setPwCharsValid] = useState();
  const [pw2Valid, setPw2Valid] = useState();
  const [fnLenValid, setFnLenValid] = useState();
  const [fnCharsValid, setFnCharsValid] = useState();
  const [lnLenValid, setLnLenValid] = useState();
  const [lnCharsValid, setLnCharsValid] = useState();

  const [isRegDisabled, setRegDisabled] = useState(true);
  const [isLogDisabled, setLogDisabled] = useState(true);

  const [isErrorLogin, setErrorLogin] = useState(false)
  const [isErrorReg, setErrorReg] = useState(false)

  useEffect(() => {
    if (login.length > 0 && password.length > 0) {
      setLogDisabled(false)
    } else {
      setLogDisabled(true)
    }

    const usernameChars = new RegExp('^[a-zA-Z0-9_.-]*$')
    setUnCharsValid(usernameChars.test(username))
    if (username.length < 4 || username.length > 20 ) {
        setUnLenValid(false) 
      } else {
      setUnLenValid(true)
    }

    const passwordChars = new RegExp('^[a-zA-Z0-9_.!"№;:?*@#$%&*^()-]*$')
    setPwCharsValid(passwordChars.test(password1))
    if ( password1.length < 8 ) {
        setPwLenValid(false) 
      } else {
      setPwLenValid(true)
    }

    if ( password1 != password2 ) {
      setPw2Valid(false)
    } else {
      setPw2Valid(true)
    }

    const namesChars = new RegExp('^[a-zA-Zа-яА-Я]*$')
    setFnCharsValid(namesChars.test(firstName))
    setLnCharsValid(namesChars.test(lastName))

    if ( firstName.length < 2 || firstName.length > 20 ) {
      setFnLenValid(false)
    } else {
      setFnLenValid(true)
    }

    if ( lastName.length < 2 || lastName.length > 20 ) {
      setLnLenValid(false)
    } else {
      setLnLenValid(true)
    }

    let validStates = [unCharsValid, unLenValid, pwLenValid, pwCharsValid, pw2Valid, fnCharsValid, fnLenValid, lnCharsValid, lnLenValid]
    let checker = arr => arr.every(v => v === true);
    setRegDisabled(!checker(validStates))
  })


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
      body: JSON.stringify({ 
        username: username, 
        password1: password1, 
        password2: password2, 
        first_name: firstName, 
        last_name: lastName 
      })
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
      <MDBContainer className="mdb-container text-center p-3 my-5 d-flex flex-column d-flex bg-light text-dark">

        <LoginViaVK/>
        <p className="fw-light my-0">or</p>
        <MDBTabs pills justify className='d-flex flex-row justify-content-between'>
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
            
            <MDBInput wrapperClass='mt-2' label='Username' id='form0Field1' onChange={(e) => setLogin(e.target.value)} value={login} type='text'/>
            <MDBInput wrapperClass='mt-2' label='Password' id='form0Field2' onChange={(e) => setPassword(e.target.value)} value={password} type='password'/>
            {isErrorLogin && 
              <MDBTypography note noteColor='danger'>
                <strong>Ошибка авторизации.</strong> Не верный логин или пароль.
              </MDBTypography>
            }
            <MDBBtn className={isLogDisabled ? "disabled mt-3" : "mt-3"} onClick={handleClick}>Sign in</MDBBtn>

          </MDBTabsPane>

          <MDBTabsPane show={justifyActive === 'tab2'}>

            <MDBInput wrapperClass='mt-2' label='Username' id='form1Field1' onChange={(e) => setUsername(e.target.value)} value={username} type='text'/>
            {(unLenValid == false && username.length != 0) && <p className='text-danger my-0'><small>Username length must be 4-20</small></p>}
            {(unCharsValid == false && username.length != 0) && <p className='text-danger my-0'><small>Username contains invalid characters</small></p>}
            <MDBInput wrapperClass='mt-2' label='First name' id='form1Field4' onChange={(e) => setFirstName(e.target.value)} value={firstName} type='text'/>
            {(fnLenValid == false && firstName.length != 0) && <p className='text-danger my-0'><small>First name length must be 2-20</small></p>}
            {(fnCharsValid == false && firstName.length != 0) && <p className='text-danger my-0'><small>First name contains invalid characters</small></p>}
            <MDBInput wrapperClass='mt-2' label='Last name' id='form1Field5' onChange={(e) => setLastName(e.target.value)} value={lastName} type='text'/>
            {(lnLenValid == false && lastName.length != 0) && <p className='text-danger my-0'><small>Last name length must be 2-20</small></p>}
            {(lnCharsValid == false&& lastName.length != 0) && <p className='text-danger my-0'><small>Last name contains invalid characters</small></p>}
            <MDBInput wrapperClass='mt-2' label='Password' id='form1Field2' onChange={(e) => setPassword1(e.target.value)} value={password1} type='password'/>
            {(pwLenValid == false && password1.length != 0) && <p className='text-danger my-0'><small>Password length must be mopre than 8</small></p>}
            {(pwCharsValid == false && password1.length != 0) && <p className='text-danger my-0'><small>Password contains invalid characters</small></p>}
            <MDBInput wrapperClass='mt-2' label='Repeat password' id='form1Field3' onChange={(e) => setPassword2(e.target.value)} value={password2} type='password'/>
            {(pw2Valid == false && password2.length != 0) && <p className='text-danger my-0'><small>Passwords must match</small></p>}
            {isErrorReg && 
              <MDBTypography note wrapperClass='mt-2' noteColor='danger'>
                <strong>Ошибка регистрации.</strong> Проверьте правильность заполнения всех полей и попробуйте ещё раз.
              </MDBTypography>
            }
            <MDBBtn className={isRegDisabled ? "disabled mt-3" : "mt-3"} onClick={handleSignUp}>Sign up</MDBBtn>

          </MDBTabsPane>

        </MDBTabsContent>

      </MDBContainer>      
    </div>

  );
}

export default AuthForm;