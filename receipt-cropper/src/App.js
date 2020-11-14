import React, { Component} from 'react';

class App extends Component {
  state = {
    src: undefined

  }

  fileHandler = (e)=>{

    const file = e.target.files[0]
    const reader = new FileReader()
    const setState = this.setState.bind(this)
    reader.onload = function(e){
      setState({src:e.target.result})
      //data:image/png;base64,iVBORw0KG
    }
    reader.readAsDataURL(file)

  }
  srcWiper = () =>{
    this.setState({src:null})
  }
  render(){
    return (
      <div className="App">
        <h1>Receipt Cropper</h1>
        {this.state.src ? <button onClick={this.srcWiper}>Clear</button> : <input id="upload" type='file' ref="upload" onChange={this.fileHandler.bind(this)}/>}
        {this.state.src ? <img src={this.state.src} width="600px" height="840px"/> : null}
      </div>
    );
  }
  
}

export default App;
