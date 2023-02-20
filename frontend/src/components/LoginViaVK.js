import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
}
from 'mdb-react-ui-kit';

function LoginViaVK() {

    const [code, setCode] = useState(0)
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setCode(params.get("code"))
        params.delete("code")
        if (code) {
            loginRequest()
        }
    })

    const params = {
        client_id: 51554511,
        redirect_uri: "http://localhost:8000/fr",
        scope:"email, first_name, last_name",
        response_type:"code",
    }


    const getCode = () => {
        window.location.href = `https://oauth.vk.com/authorize?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&scope=${params.scope}&response_type=${params.response_type}`; 
    }    

    const loginRequest = async () => {
        if (code) {
            fetch(`API/VKLogin?code=${code}`, {method: 'GET'})
              .then(response => response.json())
              .then(response => {
                if (response["code"] == 1) {
                window.location.href = 'http://localhost:8000/fr'
              }
            })
        }
    }

    return (
        <>
            <MDBBtn onClick={getCode} className='mb-4'>Login via VK</MDBBtn>
        </>
    )
}

export default LoginViaVK;