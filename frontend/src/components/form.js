import React, { useState } from 'react'

const UploadForm = () => {
    const [type, setType] = useState('text')
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [name, setName] = useState('')

    const buttonStyle = {
        width: 200,
        textAlign: 'center',
        height: 40, 
        border: 'none',
        outline: 'none',
        fontSize: '1.1em'
    }

    const upload = () => {
        
    }

    const cancel = () => {
        
    }

    return (
        <div style={{border: '1px solid #e3e3e3', height: 400, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
            <input style={{width: '90%', border: 'none', height: 30, borderBottom: '2px solid #e1e1e1', padding: 4, fontSize: '1.2em', outline: 'none'}}
                placeholder='File Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div style={{display: 'flex', margin: 0, marginTop: 30}}>
                <button style={{...buttonStyle, backgroundColor: type == 'text' ? '#5cc0ff' : 'white', color: type == 'text' ? 'white' : 'black'}}
                    onClick={() => setType('text')}
                >
                    Text
                </button>
                <button style={{...buttonStyle, backgroundColor: type == 'media' ? '#5cc0ff' : 'white', color: type == 'media' ? 'white' : 'black'}}
                    onClick={() => setType('media')}
                >
                    Media
                </button>
            </div>
            {type == 'text' ? 
                <div style={{marginTop: 40}}>
                    <textarea
                        style={{width: 300, height: 150, padding: 8}}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    />
                </div> 
                : 
                <div style={{position: 'relative', overflow: 'hidden', marginTop: 80}}>
                    <input 
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            opacity: 0,
                            cursor: 'pointer',
                            height: 40
                        }}
                        type='file'
                    />
                    <button style={{border: 'none', height: 40, width: 150, backgroundColor: '#5cc0ff', borderRadius: 25, color: 'white', fontSize: '1.1em', cursor: 'pointer'}}>
                        Upload
                    </button>
                </div>
            }
            <div style={{position: 'absolute', bottom: 10, right: 10}}>
                <button style={{margin: 4, width: 75, height: 30, borderStyle: 'none', backgroundColor: 'white', cursor: 'pointer', color: 'grey', fontSize: 16, padding: 4}}
                    onClick={() => cancel()}
                >
                    Cancel
                </button>
                <button style={{margin: 4, width: 75, height: 30, borderStyle: 'none', borderRadius: 25, backgroundColor: '#5cc0ff', border: '2px solid #5cc0ff', cursor: 'pointer', color: 'white', fontSize: 16, padding: 4}}
                    onClick={() => upload()}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default UploadForm