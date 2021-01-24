import React, { PureComponent } from 'react'
import D from '../D';
class C extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

  componentWillMount(){
    console.log('componentWillMountCCCC')
  }

  componentDidMount() {
    console.log('componentDidMountCCCC')

  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdateCCCC')
    return true
  }

  render() {
    return <div>C<D/></div>
  }
}

export default C