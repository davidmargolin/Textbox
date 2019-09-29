import React, { useState } from 'react';

const User = ({ phoneNumber, fileCount, toggleUpload, upload}) => (
  <div style={userStyle}>
    <div style={{display: 'flex'}}>
      <img style={{height: 100, borderRadius: 50, objectFit: 'contain'}} src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex'}}>
          <h4 style={{marginLeft: 30}}>{phoneNumber}</h4>
          <h4 style={{marginLeft: 30}}>{fileCount == 1 ? '1 File' : `${fileCount} Files`}</h4>
        </div>
        {!upload && 
          <button style={{margin: 4, width: 140, height: 30, borderStyle: 'none', borderRadius: 25, backgroundColor: '#5cc0ff', border: '2px solid #5cc0ff', cursor: 'pointer', color: 'white', fontSize: 16, padding: 4}}
          onClick={() => toggleUpload()}
          >Upload</button>
        }
      </div>
    </div>
  </div>
)

export default User

const userStyle= {
  marginTop: 20,
  marginBottom: 20,
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'white',
  fontWeight: 200,
  letterSpacing: '1px'
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
