import React, { Component } from "react";
import axios from "axios";
require("./contentView.css");

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  update = e => {
    this.setState({
      number: e.target.value
    });
  };

  login = () => {
    let body;
    if (this.state.number[0] === "+") {
      body = {
        number: this.state.number
      };
    } else {
      body = {
        number: "+1" + this.state.number
      };
    }
    // console.log(body)
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
                type="text"
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
