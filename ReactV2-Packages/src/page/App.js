import React from '../react/packages/react';
// import { connect } from '../react-redux/index';
import { connect } from 'react-redux';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Router from './router/react-router-dom/BrowserRouter';
import Route from './router/react-router/Route';
import Switch from './router/react-router/Switch';
import AsyncRouter, { RouterHooks } from '../lazyRouter/routerHooks'
// const A = AsyncRouter(() => import('./A'))
// const B = AsyncRouter(() => import('./B'))
// // import A from './A'
// const TestMemo = AsyncRouter(() => import('./testMemo'))
// const VisualDOM = AsyncRouter(() => import('./visualDom'));
// const LargeDom = AsyncRouter(() => import('./visualDom/largeDom'))
import A from './A';
import B from './B';
class App extends React.Component {
  componentDidMount() {
    RouterHooks.beforeRouterComponentLoad((history) => {
      console.log('当前激活的路由是', history)
    })
  }
  render() {
    return (
      <div>
       <Router>
         <Switch>
           <Route path="/" component={A} />
           <Route path="/a" component={A} />
           <Route path="/b" component={B} />
           {/* <Route path="/testMemo" component={TestMemo} />
           <Route path="/visualDom" component={VisualDOM} />
           <Route path="/largeDom" component={LargeDom} /> */}
         </Switch>
       </Router>
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {}
// }


// export default connect(mapStateToProps, null)(App);
export default App;
