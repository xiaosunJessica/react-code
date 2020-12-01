import React from '../react/packages/react';
import Receive from './receive';
class App extends React.Component {
  state = {
    count: 1
  }
  click = () => {
    this.setState({
      count: this.state.count + 1
    })
  }
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
        <span onClick={this.click}>add</span>
      </div>
    )
  }
}


export default App;
