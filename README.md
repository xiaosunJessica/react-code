
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

参考文档：
https://github.com/nannongrousong/blog/issues/1
https://github.com/bubucuo/react-sourcecode-debug-env
