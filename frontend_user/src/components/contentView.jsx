import React, { Component } from "react";
require("./contentView.css");

export default class ContentView extends Component {

  render() {
    const { type, data, name } = this.props.body;

    const content =
      type === "media" ? (
        <img src={data} alt="" className="image" />
      ) : (
        <div className="text">{data}</div>
      );
    return (
      <div className="contentViewWrapperBackground">
        <div className="contentViewWrapper">
          <button
            className="closeBtn"
            onClick={() => this.props.closeContentView()}
          >
            X
          </button>
          <div className="content">{content}</div>
          <div className="contentFooter">
            <div className="deleteBtn" onClick={() => this.props.deleteItem()}>
              Delete
            </div>
            <div className="name">{name}</div>
          </div>
        </div>
      </div>
    );
  }
}
