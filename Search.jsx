import React, { useContext } from 'react';
import { useState } from 'react';
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/Auth';
import { ChatContext } from '../context/ChatContext';

export default function Search() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    setErr(false);

    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    const q = query(collection(db, 'users'), where('displayName', '==', capitalizedUsername));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (Err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!user) {
      return;
    }

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        console.log('Updating userChats for currentUser:', currentUser.uid);

        await setDoc(doc(db, 'chats', combinedId), { messages: [] });
        await updateDoc(doc(db, 'UserChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
        await updateDoc(doc(db, 'UserChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }

      console.error('Error updating userChats:', err);
      console.log('combinedId:', combinedId);
      console.log('currentUser:', currentUser);
      console.log('user:', user);
      console.log('Update successful!');
    } catch (err) {
      console.error('Error updating userChats:', err);
    }

    setUser(null);
    setUsername('');
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          className="search-text"
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {/* { username.trim() !== '' && <span>No user found</span> */}
      {/* } */}

      {user && (
        <div className="userchat" onClick={handleSelect}>
          <>
            <img src={user.photoURL} alt="" />
            <div className="user-chat-info">
              <span>{user.displayName}</span>
            </div>
          </>
        </div>
      )}
    </div>
  );
}
