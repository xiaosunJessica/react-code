import React from "../react/packages/react";
// import { connect } from '../react-redux/index';
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import Router from './router/react-router-dom/BrowserRouter';
// import Route from './router/react-router/Route';
// import Switch from './router/react-router/Switch';
import AsyncRouter, { RouterHooks } from "../lazyRouter/routerHooks";
// const A = AsyncRouter(() => import('./A'))
// const B = AsyncRouter(() => import('./B'))
// // import A from './A'
// const TestMemo = AsyncRouter(() => import('./testMemo'))
// const VisualDOM = AsyncRouter(() => import('./visualDom'));
// const LargeDom = AsyncRouter(() => import('./visualDom/largeDom'))
const A = AsyncRouter(() => import("./A"));
const B = AsyncRouter(() => import("./B"));
// import A from './A'
const TestMemo = AsyncRouter(() => import("./testMemo"));
const VisualDOM = AsyncRouter(() => import("./visualDom/index1"));
const SwipeContainer = AsyncRouter(() => import("./SwipeContainer"));
const LargeDom = AsyncRouter(() => import("./visualDom/largeDom"));
const Fangdouyin = AsyncRouter(() => import("./fangdouyin"));
const Param = AsyncRouter(() => import("./param"));
// import A from './A';
// import B from './B';
class App extends React.Component {
  componentDidMount() {
    console.log("----====App ComponentDidMount---");
    RouterHooks.beforeRouterComponentLoad((history) => {
      console.log("当前激活的路由是", history);
    });
  }
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={A} />
            <Route exact path="/a" component={A} />
            <Route path="/b" component={B} />
            <Route path="/testMemo" component={TestMemo} />
            <Route path="/visualDom" component={VisualDOM} />
            <Route path="/largeDom" component={LargeDom} />
            <Route path="/fangdouyin" component={Fangdouyin} />
            <Route path="/swipe" component={SwipeContainer} />
            <Route path="/param" component={Param} />
          </Switch>
        </Router>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {}
// }

// export default connect(mapStateToProps, null)(App);
export default App;
