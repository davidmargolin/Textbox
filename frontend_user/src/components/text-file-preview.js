import React from 'react'

const TextPreview = ({ file, toggle }) => (
    <div style={{margin: '0.5rem', width: '15rem', height: '15rem', overflowY: 'hidden', cursor: 'pointer', backgroundColor: 'black'}} onClick={() => toggle(file)}>
        <p style={{padding: 6,color: 'white'}}>{file.data}</p>
    </div>
)

export default TextPreview