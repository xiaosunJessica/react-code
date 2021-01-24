import React from 'react';
import thunkMiddleware from "redux-thunk";
// import {createLogger} from "redux-logger";
import { combineReducers } from "redux";
import counter from './reducer';
import {createStore, applyMiddleware, compose} from 'redux'
// import * as serviceWorker from './serviceWorker';
const composeEnhancers = compose;
const devtools = window.devToolsExtension || (() => (noop) => noop);
const middleWares = [thunkMiddleware]
const store = createStore(combineReducers({counter}), composeEnhancers([applyMiddleware(...middleWares), devtools]));

export default store
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
