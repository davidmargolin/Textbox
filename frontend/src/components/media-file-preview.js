import React, { useState } from 'react'

const MediaPreview = ({ file, toggle }) => (
    <div style={{margin: '0.5rem', width: '15rem', height: '15rem', cursor: 'pointer'}} onClick={() => toggle(file)}>
        <img src={file.data} style={{height: '15rem', width: '15rem', objectFit: 'cover'}} />
    </div>
)

export default MediaPreview