import React, { useState, useEffect } from "react";
import firebase from "firebase";
import UploadForm from "./components/form.js";
import Login from "./components/login";
import Posts from "./Posts";
import User from "./User";
import ContentView from "./components/contentView";

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

firebase.initializeApp(firebaseConfig);

const Header = () => (
  <div
    style={{
      borderBottom: "1px solid #b5b5b5",
      justifyContent: "space-between",
      flex: 1,
      display: "flex",
      alignItems: "center",
      paddingTop: 18,
      paddingBottom: 18,
      paddingRight: 16,
      paddingLeft: 16
    }}
  >
    <img
      alt="Textbox logo"
      src="/logo.png"
      style={{ padding: 4, height: 50, marginRight: 16 }}
    />
    <a href="sms://+12055649506">
      <h3>Get started by texting 'help' to (205) 564-9506</h3>
    </a>
  </div>
);

const App = () => {
  const [userData, setUserData] = useState(null);
  const [formView, setFormView] = useState(false);
  const [postData, setPostData] = useState(null);
  const [status, setStatus] = useState(-1);

  const uploadMedia = file => {
    const imageRef = firebase
      .storage()
      .ref()
      .child(`TextBoxImages/+19172505500-${file.name}`);
    return imageRef
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL().then(url => url));
  };

  const uploadData = data => {
    return firebase
      .auth()
      .currentUser.getIdToken()
      .then(token =>
        fetch("https://textbox2020.herokuapp.com/", {
          method: "PUT",
          headers: { "Content-Type": "application/json", authorization: token },
          body: JSON.stringify(data)
        }).then(_ => {
          fetch("https://textbox2020.herokuapp.com/", {
            method: "Get",
            headers: {
              authorization: token
            }
          })
            .then(response => response.json())
            .then(data => {
              setUserData(data);
            });
          return true;
        })
      );
  };

  const deleteItem = id => {
    return firebase
      .auth()
      .currentUser.getIdToken()
      .then(token =>
        fetch(`https://textbox2020.herokuapp.com/${id}`, {
          method: "DELETE",
          headers: { authorization: token }
        }).then(_ => {
          setPostData(null);
          fetch("https://textbox2020.herokuapp.com/", {
            method: "Get",
            headers: {
              authorization: token
            }
          })
            .then(response => response.json())
            .then(data => {
              setUserData(data);
            });
        })
      );
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setUserData([]);
        user.getIdToken().then(token => {
          fetch("https://textbox2020.herokuapp.com/", {
            headers: {
              authorization: token
            }
          })
            .then(response => response.json())
            .then(data => {
              setUserData(data);
              setStatus(1);
            });
        });
      } else {
        setUserData(null);
        setStatus(0);
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "sign-in-button",
          {
            size: "invisible",
            callback: function(response) {}
          }
        );
      }
    });
  }, []);

  if (status === -1) {
    return <div>Loading...</div>;
  } else if (status === 0) {
    return (
      <div style={{ height: "100%" }}>
        <div id="sign-in-button" />
        <Login />
      </div>
    );
  } else
    return (
      <div style={{ height: "100%" }}>
        <div style={{ height: "100%" }}>
          <Header />
          <div
            style={{
              display: "flex",
              minHeight: window.innerHeight - 100,
              flexDirection: "column",
              backgroundColor: "#e3e3e3",
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <User
              fileCount={userData.length}
              toggleUpload={() => setFormView(true)}
              upload={formView}
            />
            {formView && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: -200,
                  top: "50%",
                  marginTop: -200
                }}
              >
                <UploadForm
                  uploadMedia={uploadMedia}
                  toggleFormView={() => setFormView(false)}
                  uploadData={data => uploadData(data)}
                />
              </div>
            )}
            <Posts
              files={userData}
              toggleFileView={data => {
                setPostData(data);
              }}
            />
          </div>
        </div>
        {postData && (
          <ContentView
            body={postData}
            closeContentView={() => {
              setPostData(null);
            }}
            deleteItem={() => deleteItem(postData._id)}
          />
        )}
      </div>
    );
};

export default App;
