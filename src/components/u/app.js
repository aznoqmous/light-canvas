import React from 'react'
import Canvas from './canvas.js'
import Asset from './asset.js'

export default class App extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      assets: []
    }
    this.assets = [];
    this.canvases = [];

    this.canvasWidth = React.createRef();
    this.canvasHeight = React.createRef();

    this.input = React.createRef();
  }

  render(){
    return (
      <div className="uidentity-app">
        <div className="settings">
          <div className="file-settings">
            <input type="file" multiple onChange={(e)=>{ this.handleChange(e.target.files) }} ref={this.input}/>
          </div>
          <div className="canvas-settings">
            <input type="number" min="0" step="100" ref={this.canvasWidth}/>
            <input type="number" min="0" step="100" ref={this.canvasHeight}/>
            <button onClick={()=>{ this.createCanvas() }}>new frame</button>
          </div>
        </div>
        <div className="workspace">
          <div className="assets">
            {this.assets.map((asset, i)=>{
              return <figure key={i} onClick={()=>{this.handleDeleteAsset(i)}}>{asset}</figure>
             })}
          </div>
          <div className="canvases">
            {this.canvases.map((canvas, i)=>{
              return (
                <figure className="uidentity-canvas" key={i}>
                {canvas}
                <div className="canvas-toolbox">
                  <span className="delete" onClick={()=>{this.handleDeleteCanvas(i)}}>delete</span>
                  <span className="export" onClick={()=>{this.handleExportCanvas(i)}}>export</span>
                </div>
                </figure>)
             })}
          </div>
        </div>
      </div>
    )
  }

  // HANDLE EVENTS
  handleChange(files){
    for(let file of files){
      this.createAsset( file )
    }
    this.input.current.value = "";
  }
  handleDeleteAsset(index){
    this.assets.splice(index, 1);
    this.refreshAssets();
  }
  handleDeleteCanvas(index){
    this.canvases.splice(index, 1);
    this.refreshCanvas();
  }
  handleExportCanvas(index){
    let canvas = this.canvases[index];
    console.log(canvas);
  }

  createAsset(file){
    let reader = new FileReader()
    reader.onload = (e) => {
      this.assets.push( <Asset src={e.target.result}/> )
      this.refreshAssets()
    };
    reader.readAsDataURL(file)
  }
  createCanvas(){
    let canvas = (
      <Canvas
        ref={(c)=>{return c;}}
        width={this.canvasWidth.current.value || window.innerWidth/4*3}
        height={this.canvasHeight.current.value || window.innerWidth/4*3}
        assets={this.assets}
        ></Canvas>
    )
    this.canvases.push(canvas)

    this.refreshCanvas()
  }

  refreshAssets(){
    this.setState({assets: this.assets})
  }
  refreshCanvas(){
    this.setState({canvas: this.canvases})
  }
}
