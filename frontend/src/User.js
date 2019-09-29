import React, { Component } from 'react';

class User extends Component {

  render() {
    return (
      <div style={userStyle}>
        <div style={userStyle}>
          <div>
            <img style={{height: 70}} src="https://uploads-ssl.webflow.com/5cbf13accf61ec22cf027807/5cbf368fd41e94bb5b08bfba_avatar-4.png"/>
          </div>
          <div style={{marginLeft: 20}}>
            <h4>(xxx)-xxx-xxxx</h4>
          </div>
        </div>
        <div style={userStyle}>
          <div>
            <h4>{this.props.numberOfPosts} Posts</h4>
          </div>
          <div style={{marginLeft: 20}}>
            <h4>Upload</h4>
          </div>
        </div>
      </div>
    );
  }
}


const userStyle= {
  "margin": 40,
  "align-items": 'center',
  "display": 'flex',
  "flex-direction": 'row',
  "justify-content": 'space-between',
  "background-color": 'white',
  "font-weight": 200,
  "letter-spacing": '1px',
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

export default User;
