import React, { Component } from "react";
import axios from "axios";
require("./contentView.css");

export default class ContentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (this.props.body.type === "media") {
      this.setState({
        isImage: true
      });
      if (this.props.body.data) {
        this.setState({
          data: this.props.body.data
        });
        console.log(this.state.data);
      }
    } else {
      if (this.props.body.data) {
        this.setState({
          data: this.props.body.data
        });
      } else {
        this.setState({
          data: "Text missing"
        });
      }
    }
    if (this.props.body.name) {
      this.setState({
        name: this.props.body.name
      });
    } else {
      this.setState({
        name: "Name missing"
      });
    }
  }

  deleteItem = () => {
    axios
    .delete("https://textbox2020.herokuapp.com/" + this.props.body._id)
      .then(response => {
        axios
        .post("https://textbox2020.herokuapp.com/", {number: this.props.body.phone})
        .then(response => {
          this.props.setUpdatedData({files: response.data, number: this.props.body.phone})
          this.props.closeContentView()
        })
      })
      .catch(error => {
        this.setState({
          error: "There's been an error deleting your file."
        });
      });
  };

  closeError = () => {
    this.setState({
      error: ""
    });
  };

  render() {
    let content;
    if (this.state.isImage) {
      if (this.props.body.data) {
        content = <img src={this.state.data} alt="" className="image" />;
      } else {
        content = <div className="noImage">No Image Available</div>;
      }
    } else {
      content = <div className="text">{this.state.data}</div>;
    }
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
          <button className="closeBtn" onClick={() => this.props.closeContentView()}>
            X
          </button>
          <div className="content">{content}</div>
          <div className="contentFooter">
            <div className="deleteBtn" onClick={this.deleteItem}>
              Delete
            </div>
            <div className="name">{this.state.name}</div>
          </div>
        </div>
        {error}
      </div>
    );
  }
}
