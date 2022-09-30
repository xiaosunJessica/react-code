import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from './react/packages/react-dom';
import App from './page/App';
// import App from './page/AppHooks';
// import App from './page/router/App'
import thunkMiddleware from "redux-thunk";
import {createStore, applyMiddleware, compose} from 'redux'
// import * as serviceWorker from './serviceWorker';
import store from './store';
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
// const App = () => {
//   return <div>
//     <p>123</p>
//     <span className="456">456</span>
//   </div>
// }
// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
