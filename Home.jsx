import React from 'react'
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import Chats from '../components/Chats';

function Home() {
  return (
    <div className='home'>
        <div className='home-container'>
           
            <Sidebar/>
            <Chat/>
        </div>
        
    </div>
  
  
    )
}

export default Home