import React from "react";
import firebase from "firebase";

const User = ({ fileCount, toggleUpload, upload }) => (
  <div style={userStyle}>
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      <div
        style={{
          minWidth: 300,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img
          alt="avatar"
          style={{ height: 100, borderRadius: 50, objectFit: "contain" }}
          src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"
        />
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "#069",
            textDecoration: "underline",
            cursor: "pointer",
            margin: 6
          }}
          onClick={() => firebase.auth().signOut()}
        >
          Log Out
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h4>{firebase.auth().currentUser.phoneNumber}</h4>
          <h4 style={{ marginTop: 0, paddingTop: 0 }}>
            {fileCount === 1 ? "1 File" : `${fileCount} Files`}
          </h4>
        </div>
        {!upload && (
          <button
            style={{
              margin: 4,
              width: 140,
              height: 30,
              borderStyle: "none",
              borderRadius: 25,
              backgroundColor: "#5cc0ff",
              border: "2px solid #5cc0ff",
              cursor: "pointer",
              color: "white",
              fontSize: 16,
              padding: 4
            }}
            onClick={() => toggleUpload()}
          >
            Upload
          </button>
        )}
      </div>
    </div>
  </div>
);

export default User;

const userStyle = {
  marginTop: "5rem",
  marginBottom: "3rem",
  justifyContent: "center",
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#e3e3e3",
  letterSpacing: "1px"
};
