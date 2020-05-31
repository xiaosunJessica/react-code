
legacyCreateRootFromDOMContainer => new Root(container, isConcurrent, shouldHydrate)

tag属性对应下图

Node_type

requestWork -> performSyncWork();->performWorkOnRoot()->renderRoot()(->workLoop(isYieldy);->performUnitOfWork()-> beginWork/completeUnitOfWork/completeWork-
>>createInstance->createElement->appendAllChildren)
->completeRoot

beginWork -> updateHostRoot -> reconcileChildren->reconcileChildFibers/mountChildFibers