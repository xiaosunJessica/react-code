<!--
 * @Author: your name
 * @Date: 2020-12-21 10:04:17
 * @LastEditTime: 2020-12-21 14:44:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-code/question/reactQS.md
-->
# 1、setState 是异步还是同步？以及如何实现多个state合并处理的
```javascript
   this.setState({
      count: 2
    })
    this.setState({
      count: 3
    })
    console.log(this.state.count, 'before setTimeout')
    setTimeout(() => {
      this.setState({
        count: 4
      })
      console.log(this.state.count, 'after setTimeout')
    })
```

    上面代码的执行过程是第一个setState/第二个setState/before setTimeout输出/setTimeout方法（但里面的setState排队等候），执行完成后进行fiber协调和commitwork提交，渲染count为3，根据scheduler策略进入setTimeout方法的执行，执行setState的fiber和commitwork。
    
  ![avatar](./setState同步和异步区别.png, '同步与异步')
    discreteUpdates方法会修改executionContext的值,同步与异步的区别是在ScheduleUpdateOnFiber函数中，executionContext是否为0，为0的时候执行flushSyncCallbackQueue，此时是进行fiber协调和commitWork等，之心完成后才完成ScheduleUpdateOnFiber, 也就完成setStaTe工作。否者是先完成setState，进行往下执行console和setTimeout，click方法完成后通过scheduler进入到flushSyncCallbackQueue流程，然后进行fiber和commitWork.
    

  ## setState同步情况：
        setTimeout/原生事件（window.addEventListener）

  ## setState异步情况：
        合成事件/钩子函数， 异步的处理是为了多个state进行合并，优化性能。它所谓的异步，只是执行顺序的问题

  ## 多个setState合并问题：
       执行setState,都是进行组件Component.prototype.setState方法的执行，它先进行enqueue
       Update，将所有更新的payload的update添加到当前的updateQuene里面，执行scheduleWork的时候，其实就是执行scheduleCallbackForRoot，它会根据当前root节点的root.callbackExpirationTime和expirationTime进行对比，只存一次
       runRootCallback方法到syncQueue中，之后进行一次renderRoot，先进行fiber处理，其中会执行processUpdateQueue方法，它就是将update链表的state进行object.assign的合并，之后进行commitWork渲染
     
  ![avatar](../assets/多个setState，是如何进行合并处理的.png， '多个setState合并')
    
   

# 2、聊聊 react的生命周期(新旧)
![avatar](../assets/React16.3.0之前生命周期, 'React16.3.0之前生命周期')
![avatar](../assets/React16.3.0之后生命周期.png, 'React16.3.0之后生命周期')

# 3、useEffect(fn, []) 和 componentDidMount 有什么差异？
  useEffect(fn, [])实现了componentDidMount的功能，但是与componentDidMount不同的是，componentDidMount在第一次执行commitLayoutEffects时就执行了componentDidMount，此时是在浏览器完成布局和绘制前进行的。 useEffect(fn, [])是在浏览器完成布局与绘制后，通过scheduler调度执行的。这样useEffect比较适合用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此在useEffect不应该执行阻塞浏览器更新屏幕的操作。
![avatar](./componentDidMount.png, 'componentDidMount')
![avatar](./useEffect模拟componentDidMount.png, 'useEffect模拟componentDidMount')

# 4、useEffect和useLayoutEffect的差异？
  它们调用时机不同, useEffect是在浏览器渲染和绘制之后才执行，但useLayoutEffect和componentDidMount/componentDidUpdate等一样，在第一次执行commitLayoutEffects的时候执行，是在浏览器渲染和绘制之前执行的。
  在执行commitMutationEffects的时候，DOM变更完成，此时同步调用effect读取DOM布局并同步触发重渲染，尽可能使用标准的useEffect以避免阻塞视觉更新。

  useEffect会在浏览器绘制后延迟执行，在组件更新前刷新上一轮渲染effect.

# 5、hooks 为什么不能放在条件判断里？
  在React内部，hooks是以链表的形式存在memoizeState属性中的，update阶段，每次执行setXX方法，链表会执行next向后移动，如果setXX写在条件判断中，条件判断不成立时，没有执行setXX方法，会导致取值出现偏移

# 6、fiber 是什么？
    Fiber是React 16中新的协调引擎，它主要目的是使Virtual DOM 可以进行增量式渲染。
    fiber是一个链表数据结构，能解决以前diff时间过长导致的卡顿问题，它用类似requestIdleCallback的机制做异步diff算法，方便做中断和恢复操作
 
6、聊一聊 diff 算法
7、调用 setState 之后发生了什么？
8、为什么虚拟dom 会提高性能?
9、错误边界是什么？它有什么用？
10、什么是 Portals？
11、React 组件间有那些通信方式?
12、React 父组件如何调用子组件中的方法？
13、React有哪些优化性能的手段?
14、为什么 React 元素有一个 $$typeof 属性？
15、React 如何区分 Class组件 和 Function组件？
isSimpleFunctionComponent
16、HTML 和 React 事件处理有什么区别?
17、什么是 suspense 组件?
18、为什么 JSX 中的组件名要以大写字母开头？
19、redux 是什么？
20、react-redux 的实现原理？
21、reudx 和 mobx 的区别？
22、redux 异步中间件有什么什么作用?
23、redux 有哪些异步中间件？

# 参考链家
[1](https://zhuanlan.zhihu.com/p/304213203)
[2](https://developers.google.cn/web/fundamentals/performance/rendering)浏览器渲染
[3] how browsers work (浏览器渲染)