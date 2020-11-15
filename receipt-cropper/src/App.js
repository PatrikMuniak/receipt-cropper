import React, { Component } from "react";
import { Cropper } from "./Cropper/Cropper";
import ReactDOM from "react-dom";

class App extends Component {
  state = {
    src: undefined,
  };

  fileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const setState = this.setState.bind(this);
    reader.onload = function (e) {
      setState({ src: e.target.result });
      //data:image/png;base64,iVBORw0KG
    };
    reader.readAsDataURL(file);
  };
  srcWiper = () => {
    this.setState({ src: null });
    const uploadField = ReactDOM.findDOMNode(this.refs.upload);
    uploadField.value = null;
    // React.findDOMNode(this.uploadRef).targe.value = null
  };

  render() {
    return (
      <div className="App">
        <h1>Receipt Cropper</h1>
        <Cropper srcWiper={this.srcWiper} src={this.state.src} />
        <input
          id="upload"
          type="file"
          ref="upload"
          onChange={this.fileHandler.bind(this)}
        />
      </div>
    );
  }
}

export default App;
