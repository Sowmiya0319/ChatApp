import React, { useState } from 'react';
import camera from '../images/camera.png';
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { ChatContext } from '../context/ChatContext';
import {
  arrayUnion,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuid } from 'uuid';
import { storage } from '../firebase';
import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from 'firebase/storage';

export default function Input() {
  const [text, setText] = useState('');
  const [img, setImage] = useState(null);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const handleSend = async () => {
    if (!text.trim() && !img) {
      // If both text and image are empty, do nothing
      return;
    }

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.error('Upload Error:', error);
        },
        
        () => {
          try{
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text.trim() ? text : null,
                  img: downloadURL,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                }),
              });
            });
          }catch{
             console.error("not in db");
          }
          
        }
      );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    setText('');
    setImage(null);

    try {
      await updateDoc(doc(db, 'UserChats', currentUser.uid), {
        [data.chatId + '.lastMessage']: { text },
        [data.chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'UserChats', data.user.uid), {
        [data.chatId + '.lastMessage']: { text },
        [data.chatId + '.date']: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating userChats document:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='input'>
      <input
        type='text'
        placeholder='Send a Message'
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKeyDown}
      />

      <div className='send'>
        <input
          type='file'
          style={{ display: 'none' }}
          id='file'
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />

        <label htmlFor='file'>
          <img className='photo' src={camera} alt='' />
        </label>
        <button onClick={handleSend} disabled={!text.trim() && !img}>
          Send
        </button>
      </div>
    </div>
  );
}