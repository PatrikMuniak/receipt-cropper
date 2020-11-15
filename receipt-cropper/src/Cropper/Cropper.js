import React, { Component, Fragment } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Cropper.css";
export class Cropper extends Component {
  getCoordinates = (event) => {
    let x = event.clientX;
    let y = event.clientY;
    console.log('this is x ', x,'this is y ', y);
  };

  render() {
    return (
      <Fragment>
        {this.props.src ? (
          <Backdrop>
            <div className="crop-box">
              <img
                onClick={this.getCoordinates}
                src={this.props.src}
                width="300px"
                height="420px"
              />
              <button
                onClick={() => {
                  this.props.srcWiper();
                }}
              >
                Clear
              </button>
            </div>
          </Backdrop>
        ) : null}
      </Fragment>
    );
  }
}
