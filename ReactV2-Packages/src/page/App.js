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
  render() {
    return (
      <div>
        <Receive count={this.state.count}  />
        <span onClick={this.click}>add</span>
      </div>
    )
  }
}

export default App;
