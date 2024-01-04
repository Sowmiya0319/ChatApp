import gallery from "../images/gallery.ico";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth ,storage} from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Link, useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
function Register() {
  const [err, setErr] = useState(false);
  const navigate=useNavigate();
  const [name,setName]=useState('');
  const handleNameChange =async (e) => {
    setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target.file.files[0];
    try {
      if (password.length < 6) {
        alert("Password is weak. It should be at least 6 characters long.");
        return; 
      }
  
    } catch (error) {
     
      setErr(true);
      console.error('Registration Error:');
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      const storageRef = ref(getStorage(), `profiles/${displayName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          setErr(true);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,


          });
          if (res.user && res.user.uid) {
            await setDoc(doc(db, 'UserChats', res.user.uid), {});
          navigate("/");
          }
          

        }
      );
    } 
    catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErr(true);
      console.error('Registration Error:', errorMessage);
    }
  };

  return (
    <div className='form-container'>
      <div className='form-wrapper'>
        <span className='logo'>Chit Chat</span>
        <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='Name' value={name} onChange={handleNameChange}/>
          <input type='email' placeholder='Email' />
          <input type='password' placeholder='Password' />
          <input id='file' style={{ display: 'none' }} type='file' />

          <label className='choose_file' htmlFor='file'>
            <img src={gallery} className='gallery-icon' alt='Profile_Pic' />
            <span>Add a Profile Photo</span>
          </label>
          <button className='sign-up'>Sign up</button>
          {/* {err && <span>Something went wrong</span>} */}
        </form>

        <Link to="/Login" style={{textDecoration:'none'}}>
        <p>Do you already have an Account? Login</p>

        </Link>
      </div>
    </div>
  );
}
export default Register;