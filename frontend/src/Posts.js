import React  from "react";
import TextFilePreview from './components/text-file-preview'
import MediaFilePreview from './components/media-file-preview'

const Posts = ({ files, toggleFileView }) => {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: '64rem', padding: '0.5rem', justifyContent: 'center'}}>
        {files.map(file => 
          file.type === 'text' ? <TextFilePreview file={file} toggle={toggleFileView}/> : <MediaFilePreview file={file} toggle={toggleFileView}/>
        )}
      </div>
    )
};

export default Posts;
