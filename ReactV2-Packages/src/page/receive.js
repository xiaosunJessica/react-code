import React from '../react/packages/react';

export default class Receive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.state.count !== nextprops.count) {
      this.setState({
        count: nextprops.count
      })
    }
  }
  render() {
    return <div>{this.state.count}</div>
  }
}