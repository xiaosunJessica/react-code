// import React, { PureComponent } from 'react';
// import { PureComponent, Component } from 'react';
import React, { Component } from './sreact';
// import ReactDOM from "./sReactDom";
import ReactDOM from "./react-dom";
function Func(props) {
  return <span>{props && props.children}</span>
}
class Cmpt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 1
		}
	}
	onCount = () => {
		this.setState({
			count: this.state.count + 1
		})
	}
  render() {
    return <div style={{color: 'red'}} onClick={this.onCount}>{this.state.count}</div>
  }
}
const JSX = <div>
	<Func>function</Func>
	<Cmpt />
</div>

ReactDOM.render(JSX, document.querySelector("#root"));