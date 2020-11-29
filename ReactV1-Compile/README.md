
legacyCreateRootFromDOMContainer => new Root(container, isConcurrent, shouldHydrate)

tag属性对应下图

Node_type

requestWork -> performSyncWork();->performWorkOnRoot()->renderRoot()(->workLoop(isYieldy);->performUnitOfWork()-> beginWork/completeUnitOfWork/completeWork-
>>createInstance->createElement->appendAllChildren)
->completeRoot

beginWork -> updateHostRoot -> reconcileChildren->reconcileChildFibers/mountChildFibers


payload属性像是虚拟dom？
push和pop方法的valueStack和fiberStack是做什么用的？
getStateFromUpdate是做什么用的

unstable_scheduleCallback 类似requestIdelCallback来实现调度功能

setState 浅拷贝
合成事件


1. 实例对象表示的意义
   fiber
2. 流程
   协调

   finishClassComponent 里执行render方法setCurrentPhase('render')
    nextEffect是怎么挂上去的
    commitBeforeMutationEffects 只处理 effectTag 是 Snapshot 的 effect。如果 ClassComponet 有 getSnapshotBeforeUpdate 这个方法，就会有 Snapshot 这个 effect。
    
    增加和删除dom元素
3. [生命周期](https://zh-hans.reactjs.org/docs/react-component.html#the-component-lifecycle)
   state

4. 事件
5. requestIdle...

参考文档：
https://github.com/nannongrousong/blog/issues/1
https://github.com/bubucuo/react-sourcecode-debug-env

