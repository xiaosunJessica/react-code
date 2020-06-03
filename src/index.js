// import React, { PureComponent } from 'react';
// import { PureComponent, Component } from 'react';
import React, { Component } from './sreact';
import ReactDOM from "./sReactDom";
// import ReactDOM from "./react-reactElement";
function Func(props) {
  return <span>{props && props.children}</span>
}
class Cmpt extends Component {
  render() {
    return <div>123</div>
  }
}
const JSX =<Func><span>12345</span></Func>

ReactDOM.render(JSX, document.querySelector("#root"));