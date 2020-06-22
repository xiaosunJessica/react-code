// import React, { PureComponent } from 'react';
// import { PureComponent, Component } from 'react';
import React from './React/react';
import ReactDOM from "./ReactDOM/sReactDom";
// import React from './sourceCode/react';
// import ReactDOM from "./sourceCode/react-dom";
// console.info(ReactDOM1, 'ReactDOMReactDOM')
function Func(props) {
  console.info(React, '----React')
  return <span>{props && props.children}</span>
}
class Cmpt extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 1
		}
	}
	onCount = () => {
		console.info('-----')
		this.setState({
			count: this.state.count + 1
		}, () => {
			console.info('test-----testtesttesttesttesttesttesttesttest')
		})
	}
  render() {
    return <div style={{color: 'red'}} onClick={this.onCount}>{this.state.count}</div>
  }
}
const JSX = <div>
	<Func>function</Func>
	<Cmpt>1</Cmpt>
</div>

ReactDOM.render(JSX, document.querySelector("#root"));