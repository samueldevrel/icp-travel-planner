import React from 'react'
import { useAuth } from './authetication';
import { useNavigate } from 'react-router-dom';

const AuthButton= () => {
  const { isAuthenticated, login, principal, logout } = useAuth()
  const navigate=useNavigate();
  return (
    <>
      {isAuthenticated ? (
     
        <button  className="get-started-button" onClick={()=>navigate("/main")}>Get Started </button>
     
      ) : (
       
           <button className="get-started-button" onClick={login} >Sign up</button>
        
      )}
    </>
  )
}

export default AuthButton;