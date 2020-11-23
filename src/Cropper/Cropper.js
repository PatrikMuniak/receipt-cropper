import React, { Component, Fragment } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Cropper.css";

export class Cropper extends Component {
  state = {
    cropSpecs: { x: 0, y: 0, width: 0, height: 0 },
    value: 50,
  };
  canvasRef = React.createRef();

  componentDidUpdate = (prevProps) => {
    if (!this.props.src) return;

    if (this.props.src !== prevProps.src) {
      const canvas = this.canvasRef.current;
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
    const focusBox = document.querySelector(".focus-box");
    focusBox.style.width = width + "px";
    focusBox.style.height = height + "px";
    focusBox.style.left = "20vw";
  };
  // getCoordinates = (event) => {
  //   let x = event.clientX;
  //   let y = event.clientY;
  //   const domRect = this.canvasRef.current.getBoundingClientRect();

  //   // bottom: 457.7593765258789
  //   // height: 412
  //   // left: 193.84375
  //   // right: 502.84375
  //   // top: 45.759376525878906
  //   // width: 309
  //   // x: 193.84375
  //   // y: 45.759376525878906
  //   const coordinate = { x: x - domRect.x, y: y - domRect.y };
  // };

  dragCropBox = (event) => {
    event.preventDefault();
    const focusBox = document.querySelector(".focus-box");
    let pressing = true;
    let posX = event.clientX;
    let posY = event.clientY;
    let deltaPosX;
    let deltaPosY;

    document.addEventListener("mouseup", () => {
      pressing = false;
    });

    document.addEventListener("mousemove", (event) => {
      if (pressing) {
        deltaPosX = event.clientX - posX;
        deltaPosY = event.clientY - posY;
        posX = event.clientX;
        posY = event.clientY;

        const canvasWidth = this.canvasRef.current.offsetWidth;
        const canvasHeight = this.canvasRef.current.offsetHeight;
        const canvasOffsetLeft = this.canvasRef.current.offsetLeft;
        const canvasOffsetTop = this.canvasRef.current.offsetTop;

        focusBox.style.top =
          canvasOffsetTop > focusBox.offsetTop + deltaPosY ||
          canvasOffsetTop + canvasHeight <
            focusBox.offsetTop + focusBox.offsetHeight + deltaPosY
            ? canvasOffsetTop + canvasHeight
            : focusBox.offsetTop + deltaPosY + "px";

        focusBox.style.left =
          canvasOffsetLeft > focusBox.offsetLeft + deltaPosX ||
          canvasOffsetLeft + canvasWidth <
            focusBox.offsetLeft + focusBox.offsetWidth + deltaPosX
            ? canvasOffsetLeft + canvasWidth
            : focusBox.offsetLeft + deltaPosX + "px";
      }
    });
  };

  resizeCropBox = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const focusPoint = event.target;
    const focusBox = document.querySelector(".focus-box");
    let pressing = true;
    let posX = event.clientX;
    let posY = event.clientY;
    let deltaPosX;
    let deltaPosY;

    const canvasRef = this.canvasRef.current;
    document.addEventListener("mouseup", () => {
      pressing = false;
      const cropSpecs = {
        x: focusBox.offsetLeft - canvasRef.offsetLeft,
        y: focusBox.offsetTop - canvasRef.offsetTop,
        width: focusBox.offsetWidth,
        height: focusBox.offsetHeight,
      };
      // console.log(cropSpecs)
      this.setState({ cropSpecs: cropSpecs });
    });

    document.addEventListener("mousemove", (event) => {
      if (pressing) {
        deltaPosX = event.clientX - posX;
        deltaPosY = event.clientY - posY;
        posX = event.clientX;
        posY = event.clientY;

        const canvasWidth = this.canvasRef.current.offsetWidth;
        const canvasHeight = this.canvasRef.current.offsetHeight;
        const canvasOffsetLeft = this.canvasRef.current.offsetLeft;
        const canvasOffsetTop = this.canvasRef.current.offsetTop;

        switch (focusPoint.classList[1]) {
          case "point-ne":
            focusBox.style.width =
              focusBox.offsetWidth - deltaPosX > canvasWidth
                ? canvasWidth
                : focusBox.offsetWidth - deltaPosX + "px";
            focusBox.style.height =
              focusBox.offsetHeight - deltaPosY > canvasHeight
                ? canvasHeight
                : focusBox.offsetHeight - deltaPosY + "px";

            focusBox.style.left =
              canvasOffsetLeft > focusBox.offsetLeft + deltaPosX ||
              focusBox.offsetLeft + deltaPosX > canvasOffsetLeft + canvasWidth
                ? canvasOffsetLeft
                : focusBox.offsetLeft + deltaPosX + "px";

            focusBox.style.top =
              canvasOffsetTop > focusBox.offsetTop + deltaPosY ||
              canvasOffsetTop + canvasHeight < focusBox.offsetTop + deltaPosY
                ? canvasOffsetTop + canvasHeight
                : focusBox.offsetTop + deltaPosY + "px";
            break;

          case "point-se":
            focusBox.style.width =
              focusBox.offsetWidth - deltaPosX > canvasWidth
                ? canvasWidth
                : focusBox.offsetWidth - deltaPosX + "px";
            focusBox.style.height =
              focusBox.offsetHeight + deltaPosY > canvasHeight
                ? canvasHeight
                : focusBox.offsetHeight + deltaPosY + "px";
            focusBox.style.left =
              canvasOffsetLeft > focusBox.offsetLeft + deltaPosX ||
              focusBox.offsetLeft + deltaPosX > canvasOffsetLeft + canvasWidth
                ? canvasOffsetLeft
                : focusBox.offsetLeft + deltaPosX + "px";

            break;

          case "point-nw":
            focusBox.style.width =
              focusBox.offsetWidth + deltaPosX > canvasWidth
                ? canvasWidth
                : focusBox.offsetWidth + deltaPosX + "px";
            focusBox.style.height =
              focusBox.offsetHeight - deltaPosY > canvasHeight
                ? canvasHeight
                : focusBox.offsetHeight - deltaPosY + "px";
            focusBox.style.top =
              canvasOffsetTop > focusBox.offsetTop + deltaPosY ||
              canvasOffsetTop + canvasHeight < focusBox.offsetTop + deltaPosY
                ? canvasOffsetTop + canvasHeight
                : focusBox.offsetTop + deltaPosY + "px";

            break;

          case "point-sw":
            focusBox.style.width =
              focusBox.offsetWidth + deltaPosX > canvasWidth
                ? canvasWidth
                : focusBox.offsetWidth + deltaPosX + "px";
            focusBox.style.height =
              focusBox.offsetHeight + deltaPosY > canvasHeight
                ? canvasHeight
                : focusBox.offsetHeight + deltaPosY + "px";
            break;
          default:
            throw "Focus point not recognised.";
        }
      }
    });
  };
  applyCrop = () => {
    console.log("applyCrop");
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cropSpecs = this.state.cropSpecs;

    const image = new Image();
    image.onload = function () {
      console.log("heeeey");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        cropSpecs.x * 10,
        cropSpecs.y * 10,
        cropSpecs.width * 10,
        cropSpecs.height * 10,
        0,
        0,
        cropSpecs.width * canvas.width / canvas.height,
        cropSpecs.height * canvas.width / canvas.height
      );
    };
    // console.log(this.props.src)
    image.src = this.props.src;
  };

  downloadCrop = () => {
    console.log("applyCrop");
    // const canvas = this.canvasRef.current;
    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");
    const cropSpecs = this.state.cropSpecs;
    canvas.width = cropSpecs.width * 10;
    canvas.height = cropSpecs.height * 10;
    const image = new Image();
    image.onload = function () {
      ctx.drawImage(
        image,
        cropSpecs.x * 10,
        cropSpecs.y * 10,
        cropSpecs.width * 10,
        cropSpecs.height * 10,
        0,
        0,
        cropSpecs.width * 10,
        cropSpecs.height * 10
      );
      const exportImg = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "filename.png";
      link.href = exportImg;
      link.click();
    };
    // console.log(this.props.src)
    image.src = this.props.src;
  };

  rotationHandler = (event) => {
    console.log(event.target.value);
    const rotationDeg = event.target.value
    const canvas = this.canvasRef.current;

    const ctx = canvas.getContext("2d");
    const cropSpecs = this.state.cropSpecs;
    canvas.width = cropSpecs.width * 10;
    canvas.height = cropSpecs.height * 10;
    const image = new Image();
    image.onload = function () {
      console.log("heeeey");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        cropSpecs.x * 10,
        cropSpecs.y * 10,
        cropSpecs.width * 10,
        cropSpecs.height * 10,
        0,
        0,
        cropSpecs.width * 10,
        cropSpecs.height * 10
      );
      const exportImg = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "filename.png";
      link.href = exportImg;
      link.click();
    };
    // console.log(this.props.src)
    image.src = this.props.src;
    this.setState({ imgRotation: rotationDeg });
  };

  
  render() {
    return (
      <Fragment>
        {this.props.src ? (
          <Backdrop>
            <div className="crop-box">
              <div
                className="focus-box"
                onMouseDown={(e) => {
                  this.dragCropBox(e);
                }}
              >
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
              <button onClick={this.downloadCrop}>Download</button>
              <button onClick={this.applyCrop}>Apply</button>
              <input
              className="slider"
                type="range"
                min={0}
                max={100}
                value={this.state.value}
                onChange={this.handleChangee}
              />
            </div>
          </Backdrop>
        ) : null}
      </Fragment>
    );
  }
}
