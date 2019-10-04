import React from "react";
import TextFilePreview from "./components/text-file-preview";
import MediaFilePreview from "./components/media-file-preview";

const Posts = ({ files, toggleFileView, upload, toggleUpload }) => {
  return (
    <div style={{ maxWidth: "64rem", padding: "0.5rem" }}>
      <span style={{flex:1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: 16}}>
        <h3 style={{ color: "white", margin: 12 }}>{files.length == 1? "1 File": `${files.length} Files`}</h3>
        {!upload && (
          <button
            style={{
              margin: 4,
              width: 140,
              height: 28,
              borderStyle: "none",
              borderRadius: 25,
              backgroundColor: "#375FC6",
              border: "2px solid #375FC6",
              cursor: "pointer",
              color: "white",
              fontSize: 14,
              padding: 4
            }}
            onClick={() => toggleUpload()}
          >
            New Upload
          </button>
        )}
      </span>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {files.map(file =>
          file.type === "text" ? (
            <TextFilePreview file={file} toggle={toggleFileView} />
          ) : (
            <MediaFilePreview file={file} toggle={toggleFileView} />
          )
        )}
      </div>
    </div>
  );
};

export default Posts;
