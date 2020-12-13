import React from '../react/packages/react';
import Receive from './receive';
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
    return (
      <div>
        {/* {this.state.count === 1 && <Receive count={this.state.count}  />} */}
        {this.state.count}
        {/* <span onClick={this.click}>add</span> */}
      </div>
    )
  }
}


export default App;
