import React, { useState } from 'react'
import ReactLoading from 'react-loading'

const UploadForm = ({ uploadMedia, number, toggleFormView, setUpdatedData }) => {
    const [type, setType] = useState('text')
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState('')
    const [error, setError] = useState({titleError: "", bodyError: "", mediaError: ""})

    const buttonStyle = {
        width: 200,
        textAlign: 'center',
        height: 40, 
        border: 'none',
        outline: 'none',
        fontSize: '1.1em'
    }

    const upload = () => {
        if(type == 'media') {
            if(media == null) {
                setError(prevState => {
                    return {...prevState, mediaError: 'Invalid/No media file selected'}
                })
            }
            if(title == "") {
                setError(prevState => {
                    return {...prevState, titleError: 'Invalid/No file name'}
                })
            }
            if(media && title != "") {
                uploadMedia(media).then(url => {
                    setLoading(true)
                    fetch('https://textbox2020.herokuapp.com/', {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            phone: number,
                            type: 'media',
                            data: url,
                            name: title
                        })
                    }).then(res => {
                        setLoading(false)
                        res.status == 200 ? setResponse('Success!') : setResponse('Failed to upload.')

                        fetch('https://textbox2020.herokuapp.com/', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                number
                            })
                        })
                        .then(response => response.json())
                        .then(data => {

                                setUpdatedData(({files: data, number}))
                                toggleFormView()
                        })
                    })
                })
            }
        } else if (type == 'text') {
            if(text == '') {
                setError(prevState => {
                    return {...prevState, bodyError: 'Invalid/No text'}
                })
            }
            if(title == '') {
                setError(prevState => {
                    return {...prevState, titleError: 'Invalid/No file name'}
                })
            }
            if(title != '' && text != '') {
                setLoading(true)
                fetch('https://textbox2020.herokuapp.com/', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        phone: number,
                        type: 'text',
                        data: text,
                        name: title
                    })
                    }).then(res => {
                        setLoading(false)
                        res.status == 200 ? setResponse('Success!') : setResponse('Failed to upload.')

                        fetch('https://textbox2020.herokuapp.com/', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                number
                            })
                        })
                        .then(response => response.json())
                        .then(data => {

                                toggleFormView()
                                setUpdatedData(({files: data, number}))

                        })
            })  }
        }
    }

    return (
        <div className="contentViewWrapperBackground">
        <div style={{border: '1px solid #e3e3e3', height: 400, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', backgroundColor: 'white'}}>
            <div>
                <input style={{width: '', border: 'none', height: 30, borderBottom: '2px solid #e1e1e1', padding: 4, fontSize: '1.2em', outline: 'none', marginTop: 4}}
                    placeholder='File Name'
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                        setError(prevState => {
                            return {...prevState, titleError: ""}
                        })
                    }}
                />
                <p style={{color: '#f7443e', margin: 6, height: 8}}>{error.titleError}</p>
            </div>
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
                        style={{width: 300, height: 150, padding: 8, resize: 'none'}}
                        onChange={(e) => {
                            setText(e.target.value)
                            setError(prevState => {
                                return {...prevState, bodyError: ""}
                            })
                        }}
                        value={text}
                    />
                    <p style={{color: '#f7443e', margin: 6}}>{error.bodyError}</p>
                </div>
                :
                <div style={{position: 'relative', overflow: 'hidden', marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
                        onChange={(e) => {
                            setMedia(e.target.files[0])
                            setError(prevState => {
                                return {...prevState, mediaError: ""}
                            })
                        }}
                    />
                    <button style={{border: 'none', height: 40, width: 150, backgroundColor: '#5cc0ff', borderRadius: 25, color: 'white', fontSize: '1.1em', cursor: 'pointer'}}>
                        Upload
                    </button>
                    {media && <p style={{color: '#5cc0ff', margin: 6}}>{media.name}</p>}
                    <p style={{color: '#f7443e', margin: 6}}>{error.mediaError}</p>
                </div>
            }
            {
                !loading && response == '' ?
                <div style={{position: 'absolute', bottom: 10, right: 10, display: 'flex'}}>
                    <div style={{margin: 4, width: 75, height: 30, borderStyle: 'none', backgroundColor: 'white', cursor: 'pointer', color: 'grey', fontSize: 16, padding: 4, textDecoration: 'none'}}
                        onClick={() => toggleFormView()}
                    >
                        Cancel
                    </div>
                    <button style={{margin: 4, width: 75, height: 30, borderStyle: 'none', borderRadius: 25, backgroundColor: '#5cc0ff', border: '2px solid #5cc0ff', cursor: 'pointer', color: 'white', fontSize: 16, padding: 4}}
                        onClick={() => upload()}
                    >
                        Save
                    </button>
                </div>
                :
                loading && response == '' ?
                <div style={{position: 'absolute', bottom: 20, right: 20}}>
                    <ReactLoading  height={30} width={50} type={'bubbles'} color={'#5cc0ff'}/>
                </div>
                : <div style={{fontSize: '1.1em', color: '#5cc0ff'}}>{response}</div>
            }
        </div>
        </div>
    )
}

export default UploadForm