import React from 'react';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Login() {
  const [err, setErr] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth,email,password);
      navigate("/")
    
    } 

    catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErr(true);
      alert("The password or username is wrong");
      console.error('Login Error:', errorMessage);
    }
  }; 
  return (

    <div className='form-container'>
      <div className='form-wrapper'>
<span className='logo'>Chit Chat</span>
<span className='title'>Login</span>
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='email'/>
                <input type='password' placeholder='password'/>
                <button type="submit" className='sign-up '>Sign in</button>
            </form>
           
       <Link to="/Register" >
       <span className='new_user'>New User ? Create a Account</span>
       </Link>
      </div>
   </div>
  )
}

export default Login;