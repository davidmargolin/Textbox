import React, { useState } from "react";
import firebase from 'firebase'
import UploadForm from './components/form.js'
import Login from './components/login'
import Posts from "./Posts"
import User from "./User"
import ContentView from './components/contentView'

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
  <div style={{height: '4rem', borderBottom: '1px solid #b5b5b5', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <input style={{padding: 4}} type='text' disabled placeholder='TextBox'/>
  </div>
)

const App = () => {
  const [userData, setUserData] = useState(null);
  const [postView, setPostView] = useState(false);
  const [formView, setFormView] = useState(false);
  const [postData, setPostData] = useState(null)

  const uploadMedia = (file) => {
    const imageRef = firebase.storage().ref().child(`TextBoxImages/+19172505500-${file.name}`)
    return imageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL().then(url => url))
  }

  return (
    <div style={{height: '100%'}}>
      {!userData ? 
        <Login getUser={(data) => setUserData(data)}/>
      :  
      <div style={{height: '100%'}}>
        <Header/>
        <div style={{display: 'flex', height: '100%', flexDirection: 'column', backgroundColor: '#e3e3e3', flex: 1, alignItems: 'center', flexShrink: 0}}>
          <User phoneNumber={userData.number} fileCount={userData.files.length} toggleUpload={() => setFormView(true)} upload={formView}/>
          {formView && 
            <div style={{position: 'absolute', left: '50%', marginLeft: -200, top: '50%', marginTop: -200}}>
              <UploadForm uploadMedia={uploadMedia} number={userData.number} toggleFormView={() => setFormView(false)} setUpdatedData={(data) => setUserData(data)}/>
            </div>
          }
          <Posts files={userData.files} 
            toggleFileView={(data) => {
              setPostData(data)
              setPostView(true)
            }}
          />
        </div>
      </div>
      }
      {postView && <ContentView body={postData} 
        closeContentView={() => setPostView(false)}
        setUpdatedData={(data) => setUserData(data)}
      />}
    </div>

  )
}


const Container={
  'flex-direction': 'column',
  'padding-bottom': 0,
  'padding-top': 0
}

const Row={
  '-webkit-box-orient': 'horizontal',
  '-webkit-box-direction': 'normal',
  '-webkit-flex-direction': 'row',
  '-ms-flex-direction': 'row',
  'flex-direction': 'row',
  'margin-bottom': 3
}
const Cell={
  'display': 'block',
  'position': 'relative',
  'width': 100
}

export default App;
