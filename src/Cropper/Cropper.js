import React, { Component, Fragment } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Cropper.css";

export class Cropper extends Component {
  state = {
    cropSpecs: { x: 0, y: 0, width: 0, height: 0 },
    imgRotation: 0,
  };
  canvasRef = React.createRef();

  componentDidUpdate = (prevProps) => {
    if (!this.props.src) return;

    if (this.props.src !== prevProps.src) {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext("2d");
      const setFocusPoints = this.setFocusPoints;
      const setState = this.setState.bind(this);
      const image = new Image();
      image.onload = function () {
        const width = this.width / 10;
        const height = this.height / 10;
        canvas.width = width;
        canvas.height = height;
        setFocusPoints(canvas);
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
        const cropSpecs = { x: 0, y: 0, width: width, height: height };
        setState({ cropSpecs: cropSpecs });
      };
      image.src = this.props.src;
    }
  };

  setFocusPoints = (canvas) => {
    const focusBox = document.querySelector(".focus-box");

    focusBox.style.top = canvas.offsetTop + "px";
    focusBox.style.width = canvas.width + "px";
    focusBox.style.height = canvas.height + "px";
    focusBox.style.left = canvas.offsetLeft + "px";
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
    let posX =
      event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
    let posY =
      event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
    let deltaPosX;
    let deltaPosY;
    const canvasWidth = this.canvasRef.current.offsetWidth;
    const canvasHeight = this.canvasRef.current.offsetHeight;
    const canvasOffsetLeft = this.canvasRef.current.offsetLeft;
    const canvasOffsetTop = this.canvasRef.current.offsetTop;

    const mouseUpHandler = function () {
      pressing = false;
    };

    const mouseMoveHandler = function (event) {
      if (pressing) {
        deltaPosX =
          event.clientX !== undefined
            ? event.clientX - posX
            : event.touches[0].clientX - posX;
        deltaPosY =
          event.clientY !== undefined
            ? event.clientY - posY
            : event.touches[0].clientY - posY;
        posX =
          event.clientX !== undefined
            ? event.clientX
            : event.touches[0].clientX;
        posY =
          event.clientY !== undefined
            ? event.clientY
            : event.touches[0].clientY;

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
    };

    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("mousemove", (event) => {
      mouseMoveHandler(event);
    });
  };

  resizeCropBox = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const focusPoint = event.target;
    const focusBox = document.querySelector(".focus-box");
    let pressing = true;
    let posX =
      event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
    let posY =
      event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
    let deltaPosX;
    let deltaPosY;
    const setState = this.setState.bind(this);

    const canvasRef = this.canvasRef.current;

    const canvasWidth = this.canvasRef.current.offsetWidth;
    const canvasHeight = this.canvasRef.current.offsetHeight;
    const canvasOffsetLeft = this.canvasRef.current.offsetLeft;
    const canvasOffsetTop = this.canvasRef.current.offsetTop;

    const mouseUpHandler = function () {
      pressing = false;
      const cropSpecs = {
        x: focusBox.offsetLeft - canvasRef.offsetLeft,
        y: focusBox.offsetTop - canvasRef.offsetTop,
        width: focusBox.offsetWidth,
        height: focusBox.offsetHeight,
      };

      setState({ cropSpecs: cropSpecs });
    };

    const mouseMoveHandler = function (event) {
      if (pressing) {
        deltaPosX =
          event.clientX !== undefined
            ? event.clientX - posX
            : event.touches[0].clientX - posX;
        deltaPosY =
          event.clientY !== undefined
            ? event.clientY - posY
            : event.touches[0].clientY - posY;
        posX =
          event.clientX !== undefined
            ? event.clientX
            : event.touches[0].clientX;
        posY =
          event.clientY !== undefined
            ? event.clientY
            : event.touches[0].clientY;

        switch (focusPoint.classList[1]) {
          case "point-nw":
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

          case "point-sw":
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

          case "point-ne":
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

          case "point-se":
            if (
              focusBox.offsetWidth + focusBox.offsetLeft + deltaPosX <
              canvasWidth + canvasOffsetLeft
            ) {
              focusBox.style.width = focusBox.offsetWidth + deltaPosX + "px";
              // focusBox.offsetWidth + deltaPosX > canvasWidth
              //   ? canvasWidth
              //   : focusBox.offsetWidth + deltaPosX + "px";
            }
            if (
              focusBox.offsetHeight + focusBox.offsetTop + deltaPosY <
              canvasHeight + canvasOffsetTop
            ) {
              focusBox.style.height = focusBox.offsetHeight + deltaPosY + "px";
              // focusBox.offsetHeight + deltaPosY > canvasHeight
              //   ? canvasHeight
              //   : focusBox.offsetHeight + deltaPosY + "px";
            }
            break;
          default:
            throw "Focus point not recognised.";
        }
        if (
          focusBox.offsetWidth + focusBox.offsetLeft >
          canvasWidth + canvasOffsetLeft
        ) {
          focusBox.style.height = canvasHeight + "px";
        }

        if (
          focusBox.offsetHeight + focusBox.offsetTop >
          canvasHeight + canvasOffsetTop
        ) {
          focusBox.style.height = canvasHeight + "px";
        }
      }
    };

    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("touchend", mouseUpHandler);

    document.addEventListener("mousemove", (event) => {
      mouseMoveHandler(event);
    });
    document.addEventListener("touchmove", (event) => {
      mouseMoveHandler(event);
    });
  };
  applyCrop = () => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cropSpecs = this.state.cropSpecs;
    const image = new Image();
    const imgRotation = this.state.imgRotation;
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((imgRotation * Math.PI) / 180);
      ctx.drawImage(
        image,
        cropSpecs.x * 10,
        cropSpecs.y * 10,
        cropSpecs.width * 10,
        cropSpecs.height * 10,
        -canvas.width / 2,
        -canvas.height / 2,
        (cropSpecs.width * canvas.width) / canvas.height,
        (cropSpecs.height * canvas.width) / canvas.height
      );
      ctx.restore();
    };

    image.src = this.props.src;
    this.setFocusPoints(canvas.width, canvas.height);
  };

  downloadCrop = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const cropSpecs = this.state.cropSpecs;
    canvas.width = cropSpecs.width * 10;
    canvas.height = cropSpecs.height * 10;
    const image = new Image();
    const imgRotation = this.state.imgRotation;

    image.onload = function () {
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((imgRotation * Math.PI) / 180);

      ctx.drawImage(
        image,
        cropSpecs.x * 10,
        cropSpecs.y * 10,
        cropSpecs.width * 10,
        cropSpecs.height * 10,
        -canvas.width / 2,
        -canvas.height / 2,
        cropSpecs.width * 10,
        cropSpecs.height * 10
      );
      const exportImg = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "filename.png";
      link.href = exportImg;
      link.click();
    };

    image.src = this.props.src;
  };

  rotationHandler = (event) => {
    const rotationDeg = event.target.value;
    const canvas = this.canvasRef.current;

    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = function () {
      ctx.save();
      ctx.clearRect(-1, -1, canvas.width + 3, canvas.height + 3);

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);

      ctx.drawImage(
        image,
        0,
        0,
        this.width,
        this.height,
        -canvas.width / 2,
        -canvas.height / 2,
        this.width / 10,
        this.height / 10
      );
      ctx.restore();
    };
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
                onTouchStart={(e) => {
                  this.dragCropBox(e);
                }}
              >
                <div
                  className="focus-point point-ne"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                  onTouchStart={(e) => {
                    this.resizeCropBox(e);
                  }}
                ></div>
                <div
                  className="focus-point point-nw"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                  onTouchStart={(e) => {
                    this.resizeCropBox(e);
                  }}
                ></div>
                <div
                  className="focus-point point-se"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                  onTouchStart={(e) => {
                    this.resizeCropBox(e);
                  }}
                ></div>
                <div
                  className="focus-point point-sw"
                  onMouseDown={(e) => {
                    this.resizeCropBox(e);
                  }}
                  onTouchStart={(e) => {
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
                min={-20}
                max={20}
                // step={0.1}
                value={this.state.imgRotation}
                onChange={this.rotationHandler}
              />
            </div>
          </Backdrop>
        ) : null}
      </Fragment>
    );
  }
}
