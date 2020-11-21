import React, { Component, Fragment } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Cropper.css";




export class Cropper extends Component {
  state = {
    initialPos: { x: 0, y: 0 },
  };
  canvasRef = React.createRef();

  componentDidUpdate = (prevProps) => {
    if (!this.props.src) return;

    if (this.props.src !== prevProps.src) {
      let canvas = this.canvasRef.current;
      const ctx = canvas.getContext("2d");
      const setFocusPoints = this.setFocusPoints;
      const image = new Image();
      image.onload = function () {
        const width = this.width / 10;
        const height = this.height / 10;
        canvas.width = width;
        canvas.height = height;
        setFocusPoints(canvas.width, canvas.height);
        ctx.drawImage(
          image,
          0,
          0,
          this.width,
          this.height,
          0,
          0,
          width,
          height
        );
      };
      image.src = this.props.src;
    }
  };
  setFocusPoints = (width, height) => {
    // const domCanv = this.canvasRef.getBoundingClientRect()
    // console.log("hit");
    // const pointNE = document.querySelector(".point-ne");
    // const pointNW = document.querySelector(".point-nw");
    // const pointSE = document.querySelector(".point-se");
    // const pointSW = document.querySelector(".point-sw");
    const focusBox = document.querySelector(".focus-box");


    // pointNE.style.left = "20vw";

    // pointNW.style.left =
    //   window.innerWidth * 0.2 + width - pointNW.offsetWidth + "px";

    // pointSE.style.left = "20vw";
    // pointSE.style.top = height - pointSE.offsetWidth + "px";

    // pointSW.style.top = height - pointSW.offsetHeight + "px";
    // pointSW.style.left =
    //   window.innerWidth * 0.2 + width - pointSW.offsetWidth + "px";


      focusBox.style.width= width+'px';
      focusBox.style.height = height+'px';
      focusBox.style.left = '20vw'

  };
  getCoordinates = (event) => {
    let x = event.clientX;
    let y = event.clientY;
    const domRect = this.canvasRef.current.getBoundingClientRect();

    // bottom: 457.7593765258789
    // height: 412
    // left: 193.84375
    // right: 502.84375
    // top: 45.759376525878906
    // width: 309
    // x: 193.84375
    // y: 45.759376525878906
    const coordinate = { x: x - domRect.x, y: y - domRect.y };
    // console.log("coordinates ", coordinate.x, coordinate.y);
  };

  dragCropBox = (event) => {
    console.log('drag')
    const focusBox = document.querySelector('.focus-box')
    let pressing = true;
    let posX = event.clientX
    let posY = event.clientY
    let deltaPosX 
    let deltaPosY

    event.preventDefault();
    document.addEventListener("mouseup", () => {
      pressing = false;
    });
    
    document.addEventListener("mousemove", (event)=>{
      if (pressing) {
        deltaPosX = event.clientX - posX
        deltaPosY = event.clientY - posY
        posX = event.clientX 
        posY = event.clientY
        // console.log(focusBox.offsetLeft, focusBox.offsetTop)
        focusBox.style.top = focusBox.offsetTop + deltaPosY + "px";
        focusBox.style.left = focusBox.offsetLeft + deltaPosX + "px";
      }
    });
  };

  resizeCropBox = (event)=>{
    event.preventDefault()
    event.stopPropagation()
    console.log('resize')
    const focusPoint = event.target;
    const focusBox = document.querySelector('.focus-box')
    let pressing = true;
    let posX = event.clientX
    let posY = event.clientY
    let deltaPosX 
    let deltaPosY

    event.preventDefault();
    document.addEventListener("mouseup", () => {
      pressing = false;
    });
    
    document.addEventListener("mousemove", (event)=>{
      if (pressing) {
        deltaPosX = event.clientX - posX
        deltaPosY = event.clientY - posY
        posX = event.clientX 
        posY = event.clientY
        console.log(focusBox.style.width)

        focusBox.style.width = focusBox.offsetWidth + deltaPosX + "px";
        focusBox.style.height = focusBox.offsetHeight + deltaPosY + "px";
        
      }
    });

  }




  render() {

    return (
      <Fragment>
        {this.props.src ? (
          <Backdrop>
            <div className="crop-box"
            onMouseDown={(e)=>{this.dragCropBox(e)}}>
              <div className="focus-box">
                <div
                  className="focus-point point-ne"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                ></div>
                <div
                  className="focus-point point-nw"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                ></div>
                <div
                  className="focus-point point-se"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                ></div>
                <div
                  className="focus-point point-sw"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                ></div>
              </div>

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
