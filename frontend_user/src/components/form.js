import React, { useState } from "react";
import ReactLoading from "react-loading";

const UploadForm = ({ uploadMedia, toggleFormView, uploadData }) => {
  const [type, setType] = useState("text");
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState({
    titleError: "",
    bodyError: "",
    mediaError: ""
  });

  const buttonStyle = {
    width: 200,
    textAlign: "center",
    height: 40,
    outline: "none",
    fontSize: "1.1em"
  };

  const upload = () => {
    if (type === "media") {
      if (media === null) {
        setError(prevState => {
          return { ...prevState, mediaError: "Invalid/No media file selected" };
        });
      }
      if (title === "") {
        setError(prevState => {
          return { ...prevState, titleError: "Invalid/No file name" };
        });
      }
      if (media && title !== "") {
        uploadMedia(media).then(url => {
          setLoading(true);
          uploadData({
            type: "media",
            data: url,
            name: title
          }).then(success => {
            setLoading(false);

            if (success) {
              setResponse("Success!");
              toggleFormView();
            } else {
              setResponse("Failed to upload.");
            }
          });
        });
      }
    } else if (type === "text") {
      if (text.trim() === "") {
        setError(prevState => {
          return { ...prevState, bodyError: "Invalid/No text" };
        });
      }
      if (title.trim() === "") {
        setError(prevState => {
          return { ...prevState, titleError: "Invalid/No file name" };
        });
      }
      if (title.trim() !== "" && text.trim() !== "") {
        setLoading(true);
        uploadData({
          type: "text",
          data: text,
          name: title
        }).then(success => {
          setLoading(false);

          if (success) {
            setResponse("Success!");
            toggleFormView();
          } else {
            setResponse("Failed to upload.");
          }
        });
      }
    }
  };

  return (
    <div className="contentViewWrapperBackground">
      <div
        style={{
          border: "1px solid #111111",
          width: 400,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "black"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", margin: 12 }}>
          <input
            style={{
              width: "",
              border: "none",
              borderBottom: "2px solid #e1e1e1",
              padding: 4,
              fontSize: "1.2em",
              backgroundColor: "black",
              color: "white",
              outline: "none"
            }}
            placeholder="File Name"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setError(prevState => {
                return { ...prevState, titleError: "" };
              });
            }}
          />
          <p style={{ color: "#f7443e", margin: 6, height: 8 }}>
            {error.titleError}
          </p>
        </div>
        <div style={{ display: "flex", margin: 30 }}>
          <button
            style={{
              ...buttonStyle,
              borderWidth: 2,
              borderTopLeftRadius: 18,
              borderBottomLeftRadius: 18,
              borderColor: "#375FC6",
              borderStyle: 'solid',
              backgroundColor: type === "text" ? "#375FC6" : "black",
              color: "white"
            }}
            onClick={() => setType("text")}
          >
            Text
          </button>
          <button
            style={{
              ...buttonStyle,
              borderWidth: 2,
              borderTopRightRadius: 18,
              borderBottomRightRadius: 18,
              borderColor: "#375FC6",
              borderStyle: 'solid',
              backgroundColor: type === "media" ? "#375FC6" : "black",
              color: "white"
            }}
            onClick={() => setType("media")}
          >
            Media
          </button>
        </div>
        {type === "text" ? (
          <div style={{ justifyContent: "center", display: "flex" }}>
            <textarea
              placeholder="Enter text you'd like to save here"
              style={{
                width: 300,
                height: 150,
                padding: 8,
                resize: "none",
                color: 'white',
                backgroundColor: "black",
                borderWidth: 0
              }}
              onChange={e => {
                setText(e.target.value);
                setError(prevState => {
                  return { ...prevState, bodyError: "" };
                });
              }}
              value={text}
            />
            <p style={{ color: "#f7443e", margin: 6 }}>{error.bodyError}</p>
          </div>
        ) : (
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <input
              style={{
                opacity: 0,
                cursor: "pointer",
                height: 40
              }}
              type="file"
              onChange={e => {
                setMedia(e.target.files[0]);
                setError(prevState => {
                  return { ...prevState, mediaError: "" };
                });
              }}
            />
            <button
              style={{
                border: "none",
                height: 40,
                width: 150,
                backgroundColor: "#375FC6",
                borderRadius: 25,
                color: "white",
                fontSize: "1.1em",
                cursor: "pointer"
              }}
            >
              Select File
            </button>
            {media && (
              <p style={{ color: "#375FC6", margin: 6 }}>{media.name}</p>
            )}
            <p style={{ color: "#f7443e", margin: 6 }}>{error.mediaError}</p>
          </div>
        )}
        {!loading && response === "" ? (
          <div
            style={{
              display: "flex",
              justifyContent: 'flex-end',
              margin: 20
            }}
          >
            <div
              style={{
                margin: 4,
                width: 75,
                height: 30,
                borderStyle: "none",
                cursor: "pointer",
                color: "grey",
                fontSize: 16,
                padding: 4,
                textDecoration: "none"
              }}
              onClick={() => toggleFormView()}
            >
              Cancel
            </div>
            <button
              style={{
                margin: 4,
                width: 75,
                borderStyle: "none",
                borderRadius: 25,
                backgroundColor: "#375FC6",
                border: "2px solid #375FC6",
                cursor: "pointer",
                color: "white",
                fontSize: 16,
                padding: 4
              }}
              onClick={() => upload()}
            >
              Save
            </button>
          </div>
        ) : loading && response.trim() === "" ? (
          <div style={{ position: "absolute", bottom: 20, right: 20 }}>
            <ReactLoading
              height={30}
              width={50}
              type={"bubbles"}
              color={"#5cc0ff"}
            />
          </div>
        ) : (
          <div style={{ fontSize: "1.1em", color: "#5cc0ff" }}>{response}</div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
