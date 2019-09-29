import React, { Component } from "react";
import axios from "axios";
require("./contentView.css");

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: "",
      error: null
    }
  }

  update = e => {
    this.setState({
      number: e.target.value
    });
  };

  login = () => {
    let body;
    if(this.state.number.length === 10) {
      if (this.state.number.charAt(0) === "+") {
        body = {
          number: this.state.number
        };
      } else {
        body = {
          number: `+1${this.state.number}`
        };
      }
      console.log(body)
      axios
        .post("https://textbox2020.herokuapp.com/", body)
        .then(response => {
          this.props.getUser({files: response.data, ...body})
        })
        .catch(error => {
          console.log(error)
          this.setState({
            error: error
          });
        });
    } else {
      this.setState({error: 'Enter a valid number'})
    }
  };

  closeError = () => {
    this.setState({
      error: ""
    });
  };

  render() {
    let error;
    if (this.state.error) {
      error = (
        <div className="error">
          <div>{this.state.error}</div>
          <button className="closeBtnSmall" onClick={this.closeError}>
            X
          </button>
        </div>
      );
    }
    return (
      <div className="contentViewWrapperBackground">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #b5b5b5', height: 'fit-content', width: '18em', backgroundColor: 'white', borderRadius: 8, padding: '0.5em'}}>
          <h4>Sign In</h4>
          <input
            type='number'
            name='number'
            placeholder='1234567890'
            onChange={(e) => e.target.value.length <= 10 && this.setState({number: e.target.value})}
            value={this.state.number}
            className="inputNumber"
          />
          <button style={{marginTop: '1.5rem', outline: 'none', border: '1px solid #5cc0ff', backgroundColor: '#5cc0ff', height: '2.5em', width: '14rem', borderRadius: 25, cursor: 'pointer'}} 
            onClick={this.login} 
          >Login</button>
        </div>
      {/* <div className="contentViewWrapperBackground">
        <div className="contentViewWrapper">
          <div className="loginContent">
            <div className="title">Login</div>
            <div className="description">Please enter your phone number:</div>
            <div className="contentFooter">
              <input
                type="text"
                name="number"
                placeholder="1234567890"
                className="inputNumber"
                onChange={this.update}
              ></input>
              <div onClick={this.login} className="loginBtn">
                Login
              </div>
            </div>
          </div>
        </div>
        {error}
      </div> */}
      </div>
    );
  }
}
