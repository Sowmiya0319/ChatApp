import React, { useContext, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/Auth';
import { db } from '../firebase';
import { useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import camera from "../images/camera.png";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  function handleSelect(p) {
    dispatch({ type: 'CHANGE_USER', payload: p });
  }

  useEffect(() => {
    const getchat = () => {
      const unsub = onSnapshot(doc(db, 'UserChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getchat();
  }, [currentUser.uid]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className='chats'>
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        <div className='userchat' key={chat[0]} onClick={() => handleSelect(chat[1]?.userInfo)}>
          <img src={chat[1]?.userInfo?.photoURL} alt='' />
          <div className='user-chat-info'>
            <span>{chat[1]?.userInfo?.displayName}</span>
            {currentUser ? (
              chat[1].lastMessage?.text && (
                <p>{truncateText(chat[1].lastMessage.text, 20)}</p>
              )
            ) : (
              <p>{truncateText(chat[1].lastMessage?.text, 20)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}