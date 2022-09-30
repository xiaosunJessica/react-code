<!--
 * @Author: your name
 * @Date: 2020-12-21 10:04:17
 * @LastEditTime: 2020-12-23 11:16:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-code/question/reactQS.md
-->

# 1、setState 是异步还是同步？（https://www.yuque.com/stickmyc/react-analysis/xeo8tr）以及如何实现多个state合并处理的

```javascript
this.setState({
  count: 2,
});
this.setState({
  count: 3,
});
console.log(this.state.count, "before setTimeout");
setTimeout(() => {
  this.setState({
    count: 4,
  });
  console.log(this.state.count, "after setTimeout");
});
```

    上面代码的执行过程是第一个setState/第二个setState/before setTimeout输出/setTimeout方法（但里面的setState排队等候），执行完成后进行fiber协调和commitwork提交，渲染count为3，根据scheduler策略进入setTimeout方法的执行，执行setState的fiber和commitwork。

<img src="https://github.com/xiaosunJessica/react-code/blob/master/question/setState%E5%90%8C%E6%AD%A5%E5%92%8C%E5%BC%82%E6%AD%A5%E5%8C%BA%E5%88%AB.png?raw=true" alt="GitHub" title="同步与异步" width="300" height="300" />  
discreteUpdates 方法会修改 executionContext 的值,同步与异步的区别是在 ScheduleUpdateOnFiber 函数中，executionContext 是否为 0，为 0 的时候执行 flushSyncCallbackQueue，此时是进行 fiber 协调和 commitWork 等，之心完成后才完成 ScheduleUpdateOnFiber, 也就完成 setStaTe 工作。否者是先完成 setState，进行往下执行 console 和 setTimeout，click 方法完成后通过 scheduler 进入到 flushSyncCallbackQueue 流程，然后进行 fiber 和 commitWork.

## setState 同步情况：

setTimeout/原生事件（window.addEventListener）

## setState 异步情况：

合成事件/钩子函数， 异步的处理是为了多个 state 进行合并，优化性能。它所谓的异步，只是执行顺序的问题

## 多个 setState 合并问题：

    执行setState,都是进行组件Component.prototype.setState方法的执行，它先进行enqueue
    Update，将所有更新的payload的update添加到当前的updateQuene里面，执行scheduleWork的时候，其实就是执行scheduleCallbackForRoot，它会根据当前root节点的root.callbackExpirationTime和expirationTime进行对比，只存一次
    runRootCallback方法到syncQueue中，之后进行一次renderRoot，先进行fiber处理，其中会执行processUpdateQueue方法，它就是将update链表的state进行object.assign的合并，之后进行commitWork渲染

## 是否每次 setState 都会合并

答案是否， 1， 2 在事件内所以是异步的，二者只会触发一次 render 操作，3， 4 是同步的，3，4 分别都会触发一次 render。

```
function onClick(event) {
  setState({a: 1}); // 1
  setState({a: 2}); // 2
  setTimeout(() => {
      setState({a: 3}); // 3
      setState({a: 4}); // 4
  }， 0);
}

```

<!-- ![avatar](../assets/多个setState，是如何进行合并处理的.png， "多个setState合并") -->

<img src="https://github.com/xiaosunJessica/react-code/blob/master/assets/%E5%A4%9A%E4%B8%AAsetState%EF%BC%8C%E6%98%AF%E5%A6%82%E4%BD%95%E8%BF%9B%E8%A1%8C%E5%90%88%E5%B9%B6%E5%A4%84%E7%90%86%E7%9A%84.png?raw=true" alt="GitHub" title="多个setState合并" width="300" height="300" />

# 2、聊聊 react 的生命周期(新旧)

<!-- ![avatar](../assets/React16.3.0之前生命周期, "React16.3.0之前生命周期") -->
<img src="https://github.com/xiaosunJessica/react-code/blob/master/assets/React16.3.0%E4%B9%8B%E5%89%8D%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png?raw=true" alt="GitHub" title="React16.3.0之前生命周期" width="300" height="300" />

<!-- ![avatar](../assets/React16.3.0之后生命周期.png, "React16.3.0之后生命周期") -->
<img src="https://github.com/xiaosunJessica/react-code/blob/master/assets/React16.3.0%E4%B9%8B%E5%90%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png?raw=true" alt="GitHub" title="React16.3.0之后生命周期" width="300" height="300" />

父子组件的生命周期执行顺序
由于父组件先进入，子组件完成后才会挂载父组件。
mounting 阶段：父组件的 componentWillMount 在子组件的 componentWillMount 之前调用，父组件的 componentDidMount 在子组件 componentDidMount 之后调用
update 阶段：父组件的 componentWillUpdate 在子组件的 componentWillUpdate 之前调用，父组件的 componentDidUpdate 在子组件的 componentDidUpdate 之后调用。

# 3、useEffect(fn, []) 和 componentDidMount 有什么差异？

useEffect(fn, [])实现了 componentDidMount 的功能，但是与 componentDidMount 不同的是，componentDidMount 在第一次执行 commitLayoutEffects 时就执行了 componentDidMount，此时是在浏览器完成布局和绘制前进行的。 useEffect(fn, [])是在浏览器完成布局与绘制后，通过 scheduler 调度执行的。这样 useEffect 比较适合用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此在 useEffect 不应该执行阻塞浏览器更新屏幕的操作。

<!-- ![avatar](./componentDidMount.png, "componentDidMount") -->
<img src="https://github.com/xiaosunJessica/react-code/blob/master/assets/componentDidMount.png?raw=true" alt="GitHub" title="componentDidMount" width="300" height="300" />
<!-- ![avatar](./useEffect模拟componentDidMount.png, "useEffect模拟componentDidMount") -->
<img src="https://github.com/xiaosunJessica/react-code/blob/master/assets/useEffect%E6%A8%A1%E6%8B%9FcomponentDidMount.png?raw=true" alt="GitHub" title="useEffect模拟componentDidMount" width="300" height="300" />

# 4、useEffect 和 useLayoutEffect 的差异？

useLayoutEffect 早于 useEffect 执行。
它们调用时机不同, useEffect 是在浏览器渲染（layout）和绘制(paint)之后才执行，但 useLayoutEffect 和 componentDidMount/componentDidUpdate 等一样，在第一次执行 commitLayoutEffects 的时候执行，是在浏览器渲染和绘制之前执行的。
在执行 commitMutationEffects 的时候，DOM 变更完成，此时同步调用 effect 读取 DOM 布局并同步触发重渲染，尽可能使用标准的 useEffect 以避免阻塞视觉更新。

useEffect 会在浏览器绘制后延迟执行，在组件更新前刷新上一轮渲染 effect.

# 5、hooks 为什么不能放在条件判断里？

在 React 内部，hooks 是以链表的形式存在 memoizeState 属性中的，update 阶段，每次执行 setXX 方法，链表会执行 next 向后移动，如果 setXX 写在条件判断中，条件判断不成立时，没有执行 setXX 方法，会导致取值出现偏移

# 6、fiber 是什么？

    Fiber是React 16中新的协调引擎，它主要目的是使Virtual DOM 可以进行增量式渲染。
    fiber是一个链表数据结构，能解决以前diff时间过长导致的卡顿问题，它用类似requestIdleCallback的机制做异步diff算法，方便做中断和恢复操作

# 7、[聊一聊 diff 算法](https://zh-hans.reactjs.org/docs/reconciliation.html#the-diffing-algorithm)

（元素/组件/key, type/props）

1.  对比不同类型的元素： 当根节点为不同类型的元素时，会拆卸原有的树并建立新的树， React 销毁原组件，建立新组件
2.  对比同一类型的元素： 当对比同类型的元素时，React 会保留 DOM 节点，仅对比更新有改变的属性，处理完当前节点后，React 继续对子节点进行递归
3.  对比同类型的组件元素：当组件更新时，组件实例保持不变，React 调用相关方法更新 props,下一步，调用 render 方法，diff 算法将在之前的结果及新的结果中进行递归
4.  对子节点进行递归：在默认条件下，递归 DOM 节点的子元素时，React 会遍历两个子元素列表，当产生差异时会生成一个 mutation. 但是 React 没有意识是否该保留原有的子元素
5.  keys： 为了解决上面问题，采用 key 属性，当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素和最新树上子元素

# 8、调用 setState 之后发生了什么？

1.  加入更新队列：调用 setState 时，其实就是调用的 Component.prototype.updateState, 将更新的 update 对象加入到 updateQueue,
2.  fiber 协调：调用 scheduleWork，进行 fiber 节点的协调，执行 reconcileChild，生成新的 fiber 数。
3.  执行 scheduler 相关方法，根据优先级高低具体调用相关方法，在 fiber 协调的过程中会对比新旧节点，并打上增删改查的相关 tag
4.  协调方法执行完成后，执行 performUnitOfWork，会对新节点生成对应的 dom, 同时回溯执行上面的方法
5.  但 performUnitOfWork 执行完毕后，进入 commitRoot 阶段，根据前面的 tag 对 DOM 进行更新操作。

# 9、为什么虚拟 dom 会提高性能?

1.  真实 DOM 挂在的属性较多，比较比较耗时，虚拟 DOM 的属性较少
2.  虚拟 DOM 相当于在 js 和真实 DOM 中添加一个缓存，利用 diff 算法避免没必要的 dom 操作，从而提高性能

# 10、错误边界是什么？它有什么用？

错误边界解决 js 错误导致整个应用崩溃的问题，它是 React 组件，可以捕获并打印发生在其子组件树任何位置的 js 错误，并渲染出备用 UI,而不是渲染哪些崩溃的子组件树，它无法处理一下场景：事件处理／异步代码／服务端渲染／它自身的错误

# 11、什么是 Portals？

Portal 提供一种将子节点渲染到存在于父组件以外的 DOM 节点

```javascript
ReactDOM.createPortal(child, container);
```

# 12、什么是 suspense 组件?

Suspense 是一个机制，让组件“等待”某个异步操作，直到该异步操作结束即可渲染。也可以用于懒加载

# 13、React 组件间有那些通信方式?

1. props （父组件向子组件通信）
2. 回调（子组件向父组件通信）
3. context （跨层级通信）
4. react-redux／mobx 等
5. 发布订阅模式

# 14、React 父组件如何调用子组件中的方法？

通过 ref 获取到子组件对象

# 15、React 有哪些优化性能的手段?

类组件

1. React.memo，props 进行浅比较
2. PureComponent
3. shouldComponentUpdate 自定义渲染逻辑

hook

1. useCallback/useMemo 通过【记住】上一次计算结果的方式在多次渲染的之间缓存计算结果

其它

1. 使用 id 作为 key
2. 通过 css 隐藏显示组件，而不是通过条件隐藏组件
3. 懒加载

# 16、hook 和 class 对比

1. hook 避免 class 的额外开支，像创建类实例和构造函数中绑定事件处理器的成本
2. hook 不需要很深的组件树嵌套，组件树小了，React 的工作量随之减少
   传统上认为，react 使用內联函数对性能的影响，每次渲染传递新的回调会破坏子组件 shouldComponentUpdate 优化，hook 从三个方面解决了这个问题
3. useCallback, 允许你在重新渲染之间保持对相同回调引用，
4. useMemo 使得控制具体子节点何时更新变得更容易，减少对纯组件的需要，
5. useReducer 减少对深层传递回调的依赖

# 17、为什么 React 元素有一个 $$typeof 属性？

目的是为了防止 XSS 攻击，因为 Symbol 无法被序列化，

# 18、React 如何区分 Class 组件 和 Function 组件？

isSimpleFunctionComponent

# 19、HTML 和 React 事件处理有什么区别?

1. HTML 是原生事件，React 是复合事件
2. HTML 事件名小写，React 事件名驼峰
3. HTML 事件挂在当前节点，React 事件都是挂在 Document 上

# 20、React 合成事件的好处

1. 兼容浏览器监听写法
2. 避免大量节点绑定事件占用内存，将事件委托到 document 上，有统一的事件处理函数，等事件冒泡到 document 上，React 从 target 节点往上遍历父元素，判断有没有元素绑定对应事件，有则触发

# 21、为什么 JSX 中的组件名要以大写字母开头？

判断渲染的是组件还是 HTML 元素

19、redux 是什么？
Redux 是 JavaScript 的状态容器，提供可预测的状态管理。优点：解决跨层级的数据交互；缺点：内容比较复杂不易上手。
20、react-redux 的实现原理？
react-redux 的的主要 API 包括 Provider/connect, 其中 Provider 是结合 context 来实现的，将 store 传入 Provider 作为当前 Context 值，使用发布订阅 Subscription 的模式来监听 store 的变化；connect 监听 store 变化，使组件响应 state 变化。 1. Subscription 类实现了发布订阅逻辑； 2. Provider 传入 store 作为 Context,便于下面组件获取，并订阅 store 的变化 subscription.onStateChange 3. connnect 高阶组件: 获取要注入到组件中的值，将它们注入到 Props；订阅 Props 变化并更新组件 4. selector, 负责获取 store 中的 state
21、redux 和 mobx 的区别？
22、redux 异步中间件有什么什么作用?
23、redux 有哪些异步中间件？
24、同构
同构为了解决 SPA 首屏和 SEO 的问题，

# 参考链家

[1](https://zhuanlan.zhihu.com/p/304213203)
[2](https://developers.google.cn/web/fundamentals/performance/rendering)浏览器渲染
[3] how browsers work (浏览器渲染) https://www.cnblogs.com/xuxg/articles/3432950.html
[4]https://www.w3.org/TR/navigation-timing-2/
[5]hooks:https://www.bilibili.com/video/av75221043?p=8
