import React from "react";
import "./Backdrop.css";

let Backdrop = function (props) {
  return <div style={{visibility:props.show ? 'visible' : 'hidden'}} className="backdrop">{props.children}</div>;
};

export default Backdrop;
