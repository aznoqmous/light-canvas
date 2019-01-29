import React from 'react'

export default class Canvas extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      assets: [],
      scale: 0.1,
      border: 0,
      width: this.props.width,
      height: this.props.height,
      refresh: true,
      classes: ['canvas'],
      loading: false
    }

    let cw = 200;
    let ch = 200;
    this.canvasScale = ( this.props.width > this.props.height )? cw / this.props.width: ch / this.props.height;

    this.canvasStyle = {
      position: 'absolute',
      left:  (cw / 2 - this.props.width / 2) + 'px' ,
      top:  (ch / 2 - this.props.height / 2) + 'px' ,
      transform: 'scale(' + this.canvasScale + ')'
    }
    console.log(this.canvasStyle);

    this.canvasHolderStyle = {
      position: 'relative',
      width: cw + 'px',
      height: ch + 'px',
      overflow: 'hidden',
      border: '1px solid black'
    }


    this.canvas = React.createRef()
    this.assets = []
    this.modifier = 1
    this.classes = ['canvas']

  }

  render(){
    return (
      <div className="canvas-container">
        <div className="canvas-holder" style={this.canvasHolderStyle}>
          <canvas className={this.state.classes.join(' ')}
          width={this.props.width}
          height={this.props.height}
          ref={this.canvas}
          style={this.canvasStyle}
          >
          {this.props.children}
          </canvas>
        </div>
        <input name="scale" type="number" step="0.01" min="0" max="1" value={this.state.scale} onChange={(e)=>{this.handleScaleChange(e, 'scale')}}/>
        <input name="border" type="number" value={this.state.border} onChange={(e)=>{this.handleScaleChange(e, 'border')}}/>
        <button className="btn btn-light canvas-refresh" onClick={(e)=>{this.handleRefresh()}}>refresh</button>
        <button className="btn btn-light canvas-add" onClick={(e)=>{this.handleAdd()}}>add</button>
      </div>
    )
  }

  componentDidMount(){
    this.c = this.canvas.current;
    this.ctx = this.c.getContext('2d');
    this.clear();

    this.pxRef = ( this.c.width < this.c.height )? this.c.width : this.c.height ;

    this.initAssets();
  }

  componentDidUpdate(){
    this.clear();
    this.draw(this.assets);
  }

  clear(){
    this.ctx.fillStyle = '#eee';
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);
  }
  draw(assets){
    assets.map((asset)=>{
      this.drawAsset(asset);
    });
  }
  drawAsset(asset){
    this.ctx.drawImage(asset, asset.drawLeft, asset.drawTop, asset.drawWidth, asset.drawHeight);
  }

  initAssets(){
    this.classAdd('loading');
    var completed = 0;

    this.props.assets.map((asset)=>{

      let newImg = new Image();
      newImg.src = asset.props.src;

      newImg.onload = (e)=>{
        completed++;
        this.afterInitAsset(newImg)

        if(completed >= this.props.assets.length - 1) {
          this.classRemove('loading')
          this.setState({assets: this.assets})
        }

      }

    })
  }
  afterInitAsset(newImg){
    this.assets.push(newImg)
    this.findRandomCanvasPosition(newImg)
  }

  findRandomCanvasPosition(asset){
    this.tries = 0
    this.ratio = asset.width / asset.height
    this.borders = 10;
    this.loop(this, asset)
  }

  loop(self, asset){
    self.tries++;
    let width =  self.modifier * self.pxRef * self.state.scale;
    // let width =  this.modifier * ( Math.random() * (self.state.scaleMax - self.state.scaleMin) + self.state.scaleMin ) * self.pxRef
    let height = self.modifier * width / self.ratio

    let left =   Math.random() * ( self.c.width - width );
    let top =  Math.random() * ( self.c.height - height );
    let rand = {
      drawWidth: width,
      drawHeight: height,
      drawLeft: left,
      drawTop: top,

      width: width + self.borders * 2,
      height: height + self.borders * 2,
      left: left - self.borders,
      top: top - self.borders,
    }

    for(let a of self.assets){
      if( self.checkColl(a, rand) ){
        if( self.tries < 1000 ) window.requestAnimationFrame(function(){self.loop(self, asset)})
        return false;
      }
    }
    asset = Object.assign(asset, rand)
  }


  checkColl(a, b){
    if(
      (
        ( a.left < b.left + b.width && a.left + a.width > b.left ) &&
        ( a.top < b.top + b.height && a.top + a.height > b.top )
      )
      ||
      (
        ( b.left < a.left + a.width && b.left + b.width > a.left ) &&
        ( b.top < a.top + a.height && b.top + b.height > a.top )
      )
    ) return true;
    return false;
  }

  handleScaleChange(e, scale){
    if(scale == 'scale') this.setState({scale: parseFloat(e.target.value)});
    if(scale == 'border') this.setState({border: parseFloat(e.target.value)});
  }
  handleRefresh(){
    this.clear();
    this.assets = [];
    this.initAssets();
  }
  handleAdd(){
    this.initAssets();
  }

  classAdd(className){
    for(let c of this.classes){
      if(c == className) return false;
    }
    this.classes.push(className)
    this.setState({classes: this.classes})
  }
  classRemove(className){
    let i = 0;
    for(let c of this.classes){
      if(c == className) this.classes.splice(i, 1)
      i++;
    }
    this.setState({classes: this.classes})
  }

}
