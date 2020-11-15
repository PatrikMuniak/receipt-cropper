import React, { Component, Fragment } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Cropper.css";
export class Cropper extends Component {
  canvasRef = React.createRef();

  componentDidUpdate = () => {
    if (!this.props.src) return;
    let canvas = this.canvasRef.current;


    
    const ctx = canvas.getContext("2d");

    console.log('canvas',canvas.width, canvas.height);
    const image = new Image();
    image.onload = function () {
      const width = this.width/10;
      const height = this.height/10;
        canvas.width = width;
        canvas.height = height;

      ctx.drawImage(image, 0, 0, this.width, this.height, 0, 0, width, height);
    };
    image.src = this.props.src;
  };
  getCoordinates = (event) => {
    let x = event.clientX;
    let y = event.clientY;
    const domRect = this.canvasRef.current.getBoundingClientRect();
    console.log(domRect)
    // bottom: 457.7593765258789
    // height: 412
    // left: 193.84375
    // right: 502.84375
    // top: 45.759376525878906
    // width: 309
    // x: 193.84375
    // y: 45.759376525878906
    const coordinate = { x: x - domRect.x, y: y - domRect.y };
    console.log("coordinates ", coordinate.x, coordinate.y);
  };

  render() {
    return (
      <Fragment>
        {this.props.src ? (
          <Backdrop>
            <div className="crop-box">
                <span>aaa</span>
              <canvas
                onClick={this.getCoordinates}
                draggable="false"
                ref={this.canvasRef}
              ></canvas>
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
