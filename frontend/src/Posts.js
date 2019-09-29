import React, { useState, useRef } from "react";
import TextFilePreview from './components/text-file-preview'
import MediaFilePreview from './components/media-file-preview'
import {Container, Row, Col} from 'react-amazing-grid'

const Posts = ({ files, toggleFileView }) => {

    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', width: 'fit-content', margin: 'auto', maxWidth: '64.5rem', padding: '0.5rem'}}>
          {files.map(file => 
            file.type == 'text' ? <TextFilePreview file={file} toggle={toggleFileView}/> : <MediaFilePreview file={file} toggle={toggleFileView}/>
          )}
        </div>
      </div>
    )
};

export default Posts;
