// import React, { PureComponent } from 'react';
// import { PureComponent, Component } from 'react';
import React, { Component } from './sreact';
// import ReactDOM from "./s-react-dom";
import ReactDOM from "./react-reactElement";
class Cmpt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    }
  }
  render() {
    return (
      <div>
      <div onClick={() => {
        this.setState({
          count: this.state.count + 1
        })
      }}>parent onClick</div>
      <div>count {this.state.count}</div>
      {this.props.children}
    </div>
    )
  }
}

const JSX =  <Cmpt><div style={{background: 'red'}}><span>12345</span></div></Cmpt>

ReactDOM.render(JSX, document.querySelector("#root"));