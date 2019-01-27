import React from 'react'

export default class FullScreenImage extends React.Component{
  constructor(props){
    super(props);

    this.iwidth = window.innerWidth;
    this.iheight = window.innerHeight;
    this.imgSrc = "https://source.unsplash.com/random/"+this.iwidth+"x"+this.iheight;

  }
  
  render(){
    return (
      <img src={this.imgSrc}/>
    )
  }

}
