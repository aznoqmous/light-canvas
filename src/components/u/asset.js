import React from 'react'

export default class Asset extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      selected: false
    }
  }

  render(){
    return (
        <img src={this.props.src} alt="asset"/>
    )
  }

}
