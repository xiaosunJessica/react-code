import React, { PureComponent } from 'react'

class D extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

  componentWillMount(){
    console.log('componentWillMountDDDD')
  }

  componentDidMount() {
    console.log('componentDidMountDDDD')

  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdateDDDD')
    return true
  }

  render() {
    return <div>D</div>
  }
}

export default D