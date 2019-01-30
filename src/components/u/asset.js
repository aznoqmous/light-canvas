import React from 'react'

export default class Asset extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      selected: false,
      loaded: false,
    }
    this.img = React.createRef();
  }

  render(){
    return (
        <img ref={this.img} src={this.props.src} alt="asset"/>
    )
  }

}
