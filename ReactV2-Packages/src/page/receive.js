import React from '../react/packages/react';

export default class Receive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count
    }
  }

  componentDidMount = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.count !== nextProps.count) {
      this.setState({
        count: nextProps.count
      })
    }
  }
  render() {
    return <div>{this.state.count}</div>
  }
}