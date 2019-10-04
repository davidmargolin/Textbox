import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import UploadForm from "./components/form.js";
import Login from "./components/login";
import Posts from "./Posts";
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
      width: "100%",
      maxWidth: "64rem",
      justifyContent: "space-between",
      flex: 1,
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      paddingTop: 18,
      backgroundColor: "#111111"
    }}
  >
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <img
        alt="Textbox logo"
        src="/logo.png"
        style={{ padding: 4, height: 50, marginRight: 16 }}
      />
      <span>
        <h3 style={{ color: "white", margin: 0 }}>TextBox</h3>
        <a href="sms://+12055649506" style={{ color: "white" }}>
          <h4 style={{ marginTop: 4, marginBottom: 0 }}>(205) 564-9506</h4>
        </a>
      </span>
    </div>
    <div
      style={{
        justifyContent: "flex-end",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h4 style={{ color: "white", margin: 0 }}>
        {firebase.auth().currentUser.phoneNumber}
      </h4>
      <button
        style={{
          textAlign: "end",
          background: "none",
          border: "none",
          padding: 0,
          color: "red",
          textDecoration: "underline",
          cursor: "pointer"
        }}
        onClick={() => firebase.auth().signOut()}
      >
        Log Out
      </button>
    </div>
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
        setStatus(0);
        setUserData(null);
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
    return <h3 style={{ color: "white", textAlign: "center" }}>Loading...</h3>;
  } else if (status === 0) {
    return (
      <div style={{ height: "100%" }}>
        <div id="sign-in-button" />
        <Login />
      </div>
    );
  } else
    return (
      <div style={{ height: "100%", backgroundColor: "#111111" }}>
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginLeft: 12,
            marginRight: 12
          }}
        >
          <Header />
          <div
            style={{
              display: "flex",
              minHeight: window.innerHeight - 100,
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
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
              toggleUpload={() => setFormView(true)}
              upload={formView}
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
