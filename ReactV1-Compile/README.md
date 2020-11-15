
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

<<<<<<< HEAD
unstable_scheduleCallback 类似requestIdelCallback来实现调度功能

参考文档：
https://github.com/nannongrousong/blog/issues/1
https://github.com/bubucuo/react-sourcecode-debug-env

=======
参考文档：
https://github.com/nannongrousong/blog/issues/1
https://github.com/bubucuo/react-sourcecode-debug-env
>>>>>>> 58b528f9ce4ea7a80c3dea04c5f1e9d4ef36e294
