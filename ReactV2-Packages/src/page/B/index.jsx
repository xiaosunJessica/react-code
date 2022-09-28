import React, { PureComponent } from 'react'
import { Link } from "react-router-dom";
class B extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

  componentWillMount(){
    console.log('componentWillMountBBBB')
  }

  componentDidMount() {
    console.log('componentDidMountBBBB')
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdateBBBB')
    return false
  }

  render() {
    console.log('render----B')
    return <div>{this.props.value}<Link to="/a">AA</Link></div>
  }
}

export default B