import React from "react";
import "./Backdrop.css";

let Backdrop = function Backdrop(props) {
  return <div className="backdrop">{props.children}</div>;
};

export default Backdrop;
