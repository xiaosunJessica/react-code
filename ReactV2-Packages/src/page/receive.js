import React from '../react/packages/react';

export default class Receive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      frag : 1,
    }
  }

  // componentDidMount = () => {
  //   this.setState({
  //     count: this.state.count + 1
  //   })
  // }

  // componentDidUpdate(prevProps) {
  //   // 典型用法（不要忘记比较 props）：
  //   if (this.props.nextProps !== prevProps.nextProps) {
  //     console.log(this.props.nextProps )
  //   }
  // }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const {count} = nextProps;
  //   // 当传入的type发生变化的时候，更新state
  //   if (count !== prevState.count) {
  //       return {
  //         count,
  //       };
  //   }
  //   // 否则，对于state不进行任何操作
  //   return null;
  // }

  // componentDidUpdate(prevProps) {
  //   // 典型用法（不要忘记比较 props）：
  //   if (this.props.count !== prevProps.count) {
  //     this.setState({
  //       frag: this.state.frag + 1
  //     })
  //   }
  // }

  componentWillUnmount = () => {
    debugger;
    console.log('componentWillUnmontcomponentWillUnmont')
  }

  render() {
    return <div>
        {this.state.count}
        <br/>
        <React.Fragment>{this.state.frag}</React.Fragment>
      </div>
  }
}