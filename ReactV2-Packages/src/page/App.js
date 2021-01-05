import React from '../react/packages/react';
import Receive from './receive';
import { connect } from 'react-redux';
class App extends React.Component {
  state = {
    count: 1
  }
  componentDidMount= () => {
    this.setState({
      count: 2
    })
  }
  // click = () => {
  //   debugger;
  //   this.setState({
  //     count: 2
  //   })
  //   this.setState({
  //     count: 3
  //   })
  //   console.log(this.state.count, 'before setTumeout')
  //   setTimeout(() => {
  //     this.setState({
  //       count: 4
  //     })
  //     console.log(this.state.count, 'after setTimeout')
  //   })
  // }
  // shouldComponentUpdate = () => {
  //   return false
  // }
  // getSnapshotBeforeUpdate = () => {
  //   debugger
  //   console.log('---getSnapshotBeforeUpdategetSnapshotBeforeUpdate-')
  // }
  render() {
    console.log(this.props, 'this.propsthis.propsthis.props')
    return (
      <div>
        {/* {this.state.count === 1 && <Receive count={this.state.count}  />} */}
        {this.state.count}
        {/* <span onClick={this.click}>add</span> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state, '----state-----')
  return {}
}


export default connect(mapStateToProps, null)(App);
