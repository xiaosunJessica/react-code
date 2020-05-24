(function(){
  function ReactRoot(container, isConcurrent, hydrate) {
    var root = createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
  }

  ReactRoot.prototype.legacy_renderSubtreeIntoContainer = function(parentComponent, children, callback) {
    var root = this._internalRoot;
    var work = new ReactWork();
    updateContainer(children, root, parentComponent, work._onCommit);
    return work;
  }

  function createContainer(container, isConcurrent, hydrate) {
    return createFiberRoot(container, isConcurrent, hydrate)
  }

  function createFiberRoot(containerInfo, isConcurrent, hydrate) {
    var uninitializedFiber = createHostRootFiber(isConcurrent);
    var root = {
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      earliestPendingTime: 0,
      latestPendingTime: 0,
      earliestSuspendedTime: 0,
      latestSuspendedTime: 0,
      latestPingedTime: 0,

      pingCache: null,

      didError: false,

      pendingCommitExpirationTime: 0,
      finishedWork: null,
      timeoutHandle: -1,
      context: null,
      pendingContext: null,
      hydrate: hydrate,
      nextExpirationTimeToWorkOn: 0,
      expirationTime: 0,
      firstBatch: null,
      nextScheduledRoot: null,

      interactionThreadID: 1,
      memoizedInteractions: new Set(),
      pendingInteractionMap: new Map()
    };
  
    uninitializedFiber.stateNode = root;
  
    return root;
  }

  function createHostRootFiber(isConcurrent) {
    return createFiber(3, null, null, 0);
  }

  var createFiber = function(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode)
  }

  function FiberNode(tag, pendingProps, key, mode) {
     // Instance
     this.tag = tag;
     this.key = key;
     this.elementType = null;
     this.type = null;
     this.stateNode = null;
   
     // Fiber
     this.return = null;
     this.child = null;
     this.sibling = null;
     this.index = 0;
   
     this.ref = null;
   
     this.pendingProps = pendingProps;
     this.memoizedProps = null;
     this.updateQueue = null;
     this.memoizedState = null;
     this.firstContextDependency = null;
   
     this.mode = mode;
   
     // Effects
     this.effectTag = 0;
     this.nextEffect = null;
   
     this.firstEffect = null;
     this.lastEffect = null;
   
     this.expirationTime = 0;
     this.childExpirationTime = 0;
   
     this.alternate = null;

  }


  var legacyRenderSubtreeIntoContainer = function(parentComponent, children, container, forceHydrate, callback) {
    console.info(container, 'container', container._reactRootContainer)
    var root = container._reactRootContainer;
    if (!root) {
      root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
      unbatchedUpdates(function() {
        if (parentComponent !== null) {
          root.legacy_renderSubtreeIntoContainer(parentComponent, children, callback);
        } else {
          root.render(children, callback)
        }

      })
    }
  }

  var legacyCreateRootFromDOMContainer = function(container, forceHydrate) {
    console.info(container, forceHydrate, 'container, forceHydratecontainer, forceHydrate')
    var shoudHydrate = forceHydrate;
    if (!shoudHydrate) {
      var rootSibling = void 0;
      while(rootSibling = container.lastChild) {
        container.removeChild(rootSibling);
      }
    }
    return new ReactRoot(container, false, shoudHydrate)
  }
  var ReactDOM = {
    render: function(element, container, callback) {
      return legacyRenderSubtreeIntoContainer(null, element, container, false, callback)
    }
  }
  module.exports = ReactDOM;
})()