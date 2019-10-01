import React, { Component } from "react";
import "./contentView.css";
import firebase from "firebase";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: "",
      error: null,
      waitingForCode: false
    };
  }

  update = e => {
    this.setState({
      number: e.target.value
    });
  };

  login = () => {
    this.setState({ error: null }, () => {
      if (this.state.number.length === 10) {
        firebase
          .auth()
          .signInWithPhoneNumber(
            `+1${this.state.number}`,
            window.recaptchaVerifier
          )
          .then(confirmationResult => {
            this.setState({ number: "", waitingForCode: true });
            window.confirmationResult = confirmationResult;
          })
          .catch(error => {
            this.setState({ error: JSON.stringify(error) });
          });
      } else {
        this.setState({ error: "Enter a valid number" });
      }
    });
  };

  submitCode = () => {
    this.setState({ error: null }, () => {
      const credential = firebase.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, this.state.number);
      firebase.auth().signInWithCredential(credential);
    });
  };
  
  render() {
    return (
      <div className="contentViewWrapperBackground">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #b5b5b5",
            height: "fit-content",
            width: "18em",
            backgroundColor: "white",
            borderRadius: 8,
            padding: "0.5em"
          }}
        >
          <h4>
            {this.state.waitingForCode
              ? "Enter Confirmation Code"
              : "Enter Your 10 Digit Phone Number"}
          </h4>
          {this.state.error && (
            <div className="error">
              <div style={{ color: "red" }}>{this.state.error}</div>
            </div>
          )}
          <input
            name="number"
            placeholder={this.state.waitingForCode?"555555":"5555555555"}
            onChange={e =>
              e.target.value.length <= 10 &&
              this.setState({ number: e.target.value })
            }
            value={this.state.number}
            className="inputNumber"
          />
          <button
            style={{
              marginTop: "1.5rem",
              outline: "none",
              border: "1px solid #5cc0ff",
              backgroundColor: "#5cc0ff",
              height: "2.5em",
              width: "14rem",
              borderRadius: 25,
              cursor: "pointer"
            }}
            onClick={() =>
              this.state.waitingForCode ? this.submitCode() : this.login()
            }
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
