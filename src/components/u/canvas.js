import React from 'react'

export default class Canvas extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      assets: [],
      scaleMin: 0.1,
      scaleMax: 0.2,
      width: this.props.width,
      height: this.props.height,
    }

    this.canvas = React.createRef();
    this.assets = [];

  }

  render(){
    return (
      <div className="canvas-container">
        <canvas className="canvas"
        width={this.props.width}
        height={this.props.height}
        ref={this.canvas}>
        {this.props.children}
        </canvas>
        <input name="min" type="number" step="0.01" min="0" max="1" value={this.state.scaleMin} onChange={(e)=>{this.handleScaleChange(e, 'min')}}/>
        <input name="max" type="number" step="0.01" min="0" max="1" value={this.state.scaleMax} onChange={(e)=>{this.handleScaleChange(e, 'max')}}/>
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
    this.ctx.drawImage(asset, asset.left, asset.top, asset.width, asset.height);
  }

  initAssets(){
    this.props.assets.map((asset)=>{

      let newImg = new Image();
      newImg.src = asset.props.src;

      newImg.onload = (e)=>{
        this.findRandomCanvasPosition(newImg);
        this.assets.push(newImg);
        this.setState({assets: this.assets});
      }

    })
  }
  findRandomCanvasPosition(asset){
    let ratio = asset.width / asset.height
    let tries = 0;
    while(1){
      if(tries >= 100) return false;
      tries++;
      let width = ( Math.random() * (this.state.scaleMax - this.state.scaleMin) + this.state.scaleMin ) * this.pxRef;
      console.log(this.state.scaleMax, this.state.scaleMin, width / this.pxRef);
      let height = width / ratio;
      let rand = {
        width: width,
        height: height,
        left: Math.random() * ( this.c.width - width ),
        top: Math.random() * ( this.c.height - height ),
      }

      for(let asset of this.assets){
        if( this.checkColl(asset, rand) ) return true;
      }

      asset = Object.assign(asset, rand);
      return false;
    }


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
    if(scale == 'min') this.setState({scaleMin: parseFloat(e.target.value)});
    else this.setState({scaleMax: parseFloat(e.target.value)});
    this.assets = [];
    this.initAssets();
  }

}
