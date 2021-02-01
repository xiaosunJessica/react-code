import React from 'react';
const routerObserveQueue = [] /*存放路由 */

export const RouterHooks = {
  // 路由组件加载之前
  beforeRouterComponentLoad: function(callback) {
    routerObserveQueue.push({
      type: 'before',
      callback
    })
  },

  afterRouterComponentDidLoaded: function(callback) {
    routerObserveQueue.push({
      type: 'after',
      callback
    })
  }
}

// 路由懒加载HOC

export default function AsyncRouter(loadRouter) {
  return class Content extends React.Component {
    constructor(props) {
      super(props)
      /*触发每个路由加载之前钩子函数 */
      this.dispatchRouterQueue('before');
      this.state = {
        Component: null
      }
    }

    dispatchRouterQueue(type) {
      const { history } = this.props;
      console.log(routerObserveQueue, 'dispatchRouterQueue')
      routerObserveQueue.forEach(item => {
        console.log(history, '-----hisotry------', item.type === type)
        if (item.type === type) item.callback(history)
      })
    }

    componentDidMount() {
      if (this.state.Component) return;
      loadRouter().then(module => module.default)
      .then(Component => {
        this.setState({Component}), () => {
          // 触发每个路由加载之后钩子函数
          this.dispatchRouterQueue('after')
        }
      })
    }

    render() {
      const { Component } = this.state;
      return Component ? <Component {...this.props} /> : null
    }
  }
}