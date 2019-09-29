import React, { Component } from "react";
import axios from "axios";
require("./contentView.css");

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  update = e => {
    this.setState({
      number: e.target.value
    });
  };

  login = () => {
    let body = {
      number: "+1" + this.state.number
    };
    axios
      .post("https://b6300b89.ngrok.io/", body)
      .then(response => {
        console.log(response); // FUNCTION PASSING DOWN HERE
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
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
        <div className="contentViewWrapper">
          <div className="loginContent">
            <div className="title">Login</div>
            <div className="description">Please enter your phone number:</div>
            <div className="contentFooter">
              <input
                min={0}
                max={9999999999}
                type="number"
                name="number"
                placeholder="111111111"
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
      </div>
    );
  }
}
