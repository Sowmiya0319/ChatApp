import React from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'
import { useContext } from 'react'
export default function Chat() {
  
  const {data}=useContext(ChatContext);
  console.log(data.displayName);

  console.log("name:"+data.user?.displayName);
  return (
    <div className='chat'>
        <div className='chatInfo'>
          
        <img src={data.user?.photoURL}  alt=""/>
          <span>{data.user?.displayName}</span>
          
          
        </div>
        <Messages/>

        <Input/>
      


    </div>

  )
  
}
