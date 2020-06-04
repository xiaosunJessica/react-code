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
    return <div>
			<div>cmpt</div>
			<div>cmpt123454</div>
		</div>
  }
}
const JSX = <div>
	<Func><span>function</span></Func>
	<Cmpt><div>123</div></Cmpt>
</div>

ReactDOM.render(JSX, document.querySelector("#root"));