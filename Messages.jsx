import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import { db } from '../firebase';
import { doc } from 'firebase/firestore';
import { ChatContext } from '../context/ChatContext';
import { onSnapshot } from 'firebase/firestore';

function Messages() {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [data.chatId]);

  return (
    <div className='messages'>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
}

export default Messages;
