import React, { useContext } from 'react'
import user from '../images/user.png'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'
export default function Navbar() {
  const {currentUser}=useContext(AuthContext);
  return (
    <div className='navbar'>
    <span className='logo'>Chit Chat</span>
    <div className='user'>
    <img src={currentUser.photoURL} className='user-image' alt="user"/>
    <span >{currentUser.displayName}</span>
    <Link to="/Register">
    <button onClick={()=>signOut(auth)} className='button'>Logout</button>

    </Link>
    </div>
    
    
    </div>
  )
}