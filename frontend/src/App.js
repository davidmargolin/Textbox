import React, { useState, useEffect } from "react";
import firebase from 'firebase'
import UploadForm from './components/form.js'
import Login from './components/login'

const firebaseConfig = {
  apiKey: "AIzaSyAnHDEuW-Wv7eJ0coqtyD_UO-HtCXYir-0",
  authDomain: "textbox-b83ce.firebaseapp.com",
  databaseURL: "https://textbox-b83ce.firebaseio.com",
  projectId: "textbox-b83ce",
  storageBucket: "textbox-b83ce.appspot.com",
  messagingSenderId: "1025744947126",
  appId: "1:1025744947126:web:c44aab1337fd699cbb2317",
  measurementId: "G-3MMFE50B69"
};

firebase.initializeApp(firebaseConfig)

const Header = () => (
  <div style={{height: 46, borderBottom: '1px solid #e3e3e3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <input style={{padding: 4}} type='text' disabled placeholder='TextBox'/>
  </div>
)

const App = () => {
  const [userData, setUserData] = useState(null)

  const uploadMedia = (file) => {
    const imageRef = firebase.storage().ref().child(`TextBoxImages/+19172505500-${file.name}`)
    return imageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL().then(url => url))
  }
  
  return (
    <div>
      <Header/>
      {!userData ? 
        <Login getUser={setUserData} />
      :  
      <div></div>
      }
      {console.log(userData)}
    </div>
  )
}

export default App;
