import React, { useContext, useEffect, useRef } from 'react'
import gallery from "../images/wow.avif";
import { AuthContext } from '../context/Auth';
import { ChatContext } from '../context/ChatContext';
export default function Message({message}) {
    const { currentUser } = useContext(AuthContext);
    const {data}=useContext(ChatContext);
    const ref=useRef()
    function formatTime(timestamp) {
        const date = new Date(timestamp.seconds * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
      
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      }
      
useEffect(()=>
{
    ref.current?.scrollIntoView({behaviour:"smooth"})
},[message])
    return (
     
     <div>
            <div  ref={ref} className={`message ${message.senderId===currentUser.uid && "owner"}`}>
                    <div  className='messageInfo'>
                        <img className="profile"
                            src={message.senderId===currentUser.uid? currentUser.photoURL:data.user.photoURL}
                             alt="profile"/> 
      <span>{formatTime(message.date)}</span>

                    </div>
                     <div className='messageContent'>
                     {message.text && <p>{message.text}</p>}
                                 {message.img && <img src={message.img} alt="" />}
                     </div>
                </div>
     </div>

             
     
  

    )
}
