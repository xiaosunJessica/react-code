import React from './react/packages/react';
class App extends React.Component {
  state = {
    count: 1
  }
  click = () => {
    debugger;
    this.setState({
      count: this.state.count + 1
    })
  }
  render() {
    return (
      <div>{this.state.count} <span onClick={this.click}>add</span></div>
    )
  }
}

export default App;
