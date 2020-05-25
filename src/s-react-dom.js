
(function(){
  var _assign = require('object-assign');
  var checkPropTypes = require('prop-types/checkPropTypes');
	var emptyContextObject = {};
  {
    Object.freeze(emptyContextObject);
	}

	var warnedAboutMissingGetChildContext = void 0;
  
  {
    warnedAboutMissingGetChildContext = {};
	}
	
	var phase = null;
	
	var ClassComponent = 1;
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
  
  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
  
  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	var FAUX_ITERATOR_SYMBOL = '@@iterator';
	
	var Pending = 0;
  var Resolved = 1;
	var Rejected = 2;

	var currentPhase = null;
	var currentPhaseFiber = null;
	var hasScheduledUpdateInCurrentPhase = false;
	var isCommitting = false;
	var labelsInCurrentCommit = new Set();
	var enableUserTimingAPI = true;
	var reactEmoji = '\u269B';

	var didWarnAboutNestedUpdates = void 0;
  var didWarnAboutFindNodeInStrictMode = void 0;
  
  {
    didWarnAboutNestedUpdates = false;
    didWarnAboutFindNodeInStrictMode = {};
	}
	
	var hasScheduledUpdateInCurrentCommit = false;
  function ReactRoot(container, isConcurrent, hydrate) {
    var root = createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
  }

  ReactRoot.prototype.legacy_renderSubtreeIntoContainer = function(parentComponent, children, callback) {
		var work = new ReactWork();
    return work;
	}
	ReactRoot.prototype.render = function (children, callback) {
		var work = new ReactWork();
		var root = this._internalRoot;
		updateContainer(children, root, null, work._onCommit);
    return work;
	};
	
	  
  function updateContainer(element, container, parentComponent, callback) {
    return updateContainerAtExpirationTime(element, container, parentComponent, callback);
	}
	
	function updateContainerAtExpirationTime(element, container, parentComponent, callback) {
    // TODO: If this is a nested container, this won't be the root.
    var current$$1 = container.current;
 
    var context = getContextForSubtree(parentComponent);
    if (container.context === null) {
      container.context = context;
    } else {
      container.pendingContext = context;
    }
  
    return scheduleRootUpdate(current$$1, element, callback);
	}
	
	function getContextForSubtree(parentComponent) {
    if (!parentComponent) {
      return emptyContextObject;
    }
  
    var fiber = get(parentComponent);
    var parentContext = findCurrentUnmaskedContext(fiber);
  
    if (fiber.tag === ClassComponent) {
      var Component = fiber.type;
      if (isContextProvider(Component)) {
        return processChildContext(fiber, Component, parentContext);
      }
    }
  
    return parentContext;
	}
	
	function get(key) {
    return key._reactInternalFiber;
	}
	
	function isContextProvider(type) {
    var childContextTypes = type.childContextTypes;
    return childContextTypes !== null && childContextTypes !== undefined;
	}

	function setCurrentPhase(lifeCyclePhase) {
    {
      phase = lifeCyclePhase;
    }
	}

	function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
	}
	
	function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
	}
	var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';
	function startPhaseTimer(fiber, phase) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      clearPendingPhaseMeasurement();
      if (!beginFiberMark(fiber, phase)) {
        return;
      }
      currentPhaseFiber = fiber;
      currentPhase = phase;
    }
	}
	
	var clearPendingPhaseMeasurement = function () {
    if (currentPhase !== null && currentPhaseFiber !== null) {
      clearFiberMark(currentPhaseFiber, currentPhase);
    }
    currentPhaseFiber = null;
    currentPhase = null;
    hasScheduledUpdateInCurrentPhase = false;
	};
	
	var beginFiberMark = function (fiber, phase) {
    var componentName = getComponentName(fiber.type) || 'Unknown';
    var debugID = fiber._debugID;
    var isMounted = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted, phase);
  
    if (isCommitting && labelsInCurrentCommit.has(label)) {
      // During the commit phase, we don't show duplicate labels because
      // there is a fixed overhead for every measurement, and we don't
      // want to stretch the commit phase beyond necessary.
      return false;
    }
    labelsInCurrentCommit.add(label);
  
    var markName = getFiberMarkName(label, debugID);
    beginMark(markName);
    return true;
  };
	
	var clearFiberMark = function (fiber, phase) {
    var componentName = getComponentName(fiber.type) || 'Unknown';
    var debugID = fiber._debugID;
    var isMounted = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted, phase);
    var markName = getFiberMarkName(label, debugID);
    clearMark(markName);
	};
	
	var getFiberMarkName = function (label, debugID) {
    return label + ' (#' + debugID + ')';
	};
	
	var beginMark = function (markName) {
    performance.mark(formatMarkName(markName));
	};
	
	var clearMark = function (markName) {
    performance.clearMarks(formatMarkName(markName));
	};



	function stopPhaseTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      // if (currentPhase !== null && currentPhaseFiber !== null) {
      //   var warning = hasScheduledUpdateInCurrentPhase ? 'Scheduled a cascading update' : null;
      //   endFiberMark(currentPhaseFiber, currentPhase, warning);
      // }
      currentPhase = null;
      currentPhaseFiber = null;
    }
  }
	
	var formatMarkName = function (markName) {
    return reactEmoji + ' ' + markName;
  };
	
	function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }
    {
      if (typeof type.tag === 'number') {
        console.info(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }
    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }
    if (typeof type === 'string') {
      return type;
    }
    switch (type) {
      case REACT_CONCURRENT_MODE_TYPE:
        return 'ConcurrentMode';
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';
      case REACT_PORTAL_TYPE:
        return 'Portal';
      case REACT_PROFILER_TYPE:
        return 'Profiler';
      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';
      case REACT_SUSPENSE_TYPE:
        return 'Suspense';
    }
    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return 'Context.Consumer';
        case REACT_PROVIDER_TYPE:
          return 'Context.Provider';
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE:
          {
            var thenable = type;
            var resolvedThenable = refineResolvedLazyComponent(thenable);
            if (resolvedThenable) {
              return getComponentName(resolvedThenable);
            }
          }
      }
    }
    return null;
  }
	
	function processChildContext(fiber, type, parentContext) {
    var instance = fiber.stateNode;
    var childContextTypes = type.childContextTypes;
  
    // TODO (bvaughn) Replace this behavior with an invariant() in the future.
    // It has only been added in Fiber to match the (unintentional) behavior in Stack.
    if (typeof instance.getChildContext !== 'function') {
      {
        var componentName = getComponentName(type) || 'Unknown';
  
        if (!warnedAboutMissingGetChildContext[componentName]) {
          warnedAboutMissingGetChildContext[componentName] = true;
          console.info(false, '%s.childContextTypes is specified but there is no getChildContext() method ' + 'on the instance. You can either define getChildContext() on %s or remove ' + 'childContextTypes from it.', componentName, componentName);
        }
      }
      return parentContext;
    }
  
    var childContext = void 0;
    {
      setCurrentPhase('getChildContext');
    }
    startPhaseTimer(fiber, 'getChildContext');
    childContext = instance.getChildContext();
    stopPhaseTimer();
    {
      setCurrentPhase(null);
    }
    for (var contextKey in childContext) {
      !(contextKey in childContextTypes) ? console.info(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(type) || 'Unknown', contextKey) : void 0;
    }
    return _assign({}, parentContext, childContext);
	}
	
	var getFiberLabel = function (componentName, isMounted, phase) {
    if (phase === null) {
      // These are composite component total time measurements.
      return componentName + ' [' + (isMounted ? 'update' : 'mount') + ']';
    } else {
      // Composite component methods.
      return componentName + '.' + phase;
    }
  };
  
  function scheduleRootUpdate(current$$1, element, callback) {
  // {
    //   if (phase === 'render' && current !== null && !didWarnAboutNestedUpdates) {
    //     didWarnAboutNestedUpdates = true;
    //     console.info(false, 'Render methods should be a pure function of props and state; ' + 'triggering nested component updates from render is not allowed. ' + 'If necessary, trigger nested updates in componentDidUpdate.\n\n' + 'Check the render method of %s.', getComponentName(current.type) || 'Unknown');
    //   }
    // }
  
    var update = createUpdate(1073741823);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = { element: element };
  
    // flushPassiveEffects();
    enqueueUpdate(current$$1, update);
    scheduleWork(current$$1, 1073741823);
  
    return 1073741823;
	}

	function createUpdate(expirationTime) {
    return {
      expirationTime: expirationTime,
  
      tag: 0,
      payload: null,
      callback: null,
  
      next: null,
      nextEffect: null
    };
	}
	
	function enqueueUpdate(fiber, update) {
    // Update queues are created lazily.
    var alternate = fiber.alternate;
    var queue1 = void 0;
    var queue2 = void 0;
    if (alternate === null) {
      // There's only one fiber.
      queue1 = fiber.updateQueue;
      queue2 = null;
      if (queue1 === null) {
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
      }
    } else {
      // There are two owners.
      queue1 = fiber.updateQueue;
      queue2 = alternate.updateQueue;
      if (queue1 === null) {
        if (queue2 === null) {
          // Neither fiber has an update queue. Create new ones.
          queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
          queue2 = alternate.updateQueue = createUpdateQueue(alternate.memoizedState);
        } else {
          // Only one fiber has an update queue. Clone to create a new one.
          queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
        }
      } else {
        if (queue2 === null) {
          // Only one fiber has an update queue. Clone to create a new one.
          queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
        } else {
          // Both owners have an update queue.
        }
      }
    }
    if (queue2 === null || queue1 === queue2) {
      // There's only a single queue.
      appendUpdateToQueue(queue1, update);
    } else {
      // There are two queues. We need to append the update to both queues,
      // while accounting for the persistent structure of the list — we don't
      // want the same update to be added multiple times.
      if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
        // One of the queues is not empty. We must add the update to both queues.
        appendUpdateToQueue(queue1, update);
        appendUpdateToQueue(queue2, update);
      } else {
        // Both queues are non-empty. The last update is the same in both lists,
        // because of structural sharing. So, only append to one of the lists.
        appendUpdateToQueue(queue1, update);
        // But we still need to update the `lastUpdate` pointer of queue2.
        queue2.lastUpdate = update;
      }
    }
  
	}

	function createUpdateQueue(baseState) {
    var queue = {
      baseState: baseState,
      firstUpdate: null,
      lastUpdate: null,
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
      firstEffect: null,
      lastEffect: null,
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
    return queue;
  }
  
  function cloneUpdateQueue(currentQueue) {
    var queue = {
      baseState: currentQueue.baseState,
      firstUpdate: currentQueue.firstUpdate,
      lastUpdate: currentQueue.lastUpdate,
  
      // TODO: With resuming, if we bail out and resuse the child tree, we should
      // keep these effects.
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
  
      firstEffect: null,
      lastEffect: null,
  
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
    return queue;
  }
	
	function scheduleWork(fiber, expirationTime) {
    var root = scheduleWorkToRoot(fiber, expirationTime);
    if (root === null) {
      {
        switch (fiber.tag) {
          case ClassComponent:
            warnAboutUpdateOnUnmounted(fiber, true);
            break;
          case FunctionComponent:
          case ForwardRef:
          case MemoComponent:
          case SimpleMemoComponent:
            warnAboutUpdateOnUnmounted(fiber, false);
            break;
        }
      }
      return;
    }
  
    if (!isWorking && nextRenderExpirationTime !== NoWork && expirationTime > nextRenderExpirationTime) {
      // This is an interruption. (Used for performance tracking.)
      interruptedBy = fiber;
      resetStack();
    }
    markPendingPriorityLevel(root, expirationTime);
    if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit...
    !isWorking || isCommitting$1 ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root) {
      var rootExpirationTime = root.expirationTime;
      requestWork(root, rootExpirationTime);
    }
    // if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    //   // Reset this back to zero so subsequent updates don't throw.
    //   nestedUpdateCount = 0;
    //   invariant(false, 'Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.');
    // }
	}
	
	function scheduleWorkToRoot(fiber, expirationTime) {
    recordScheduleUpdate();
  
    {
      if (fiber.tag === ClassComponent) {
        var instance = fiber.stateNode;
        warnAboutInvalidUpdates(instance);
      }
    }
  
    // Update the source fiber's expiration time
    if (fiber.expirationTime < expirationTime) {
      fiber.expirationTime = expirationTime;
    }
    var alternate = fiber.alternate;
    if (alternate !== null && alternate.expirationTime < expirationTime) {
      alternate.expirationTime = expirationTime;
    }
    // Walk the parent path to the root and update the child expiration time.
    var node = fiber.return;
    var root = null;
    if (node === null && fiber.tag === HostRoot) {
      root = fiber.stateNode;
    } else {
      while (node !== null) {
        alternate = node.alternate;
        if (node.childExpirationTime < expirationTime) {
          node.childExpirationTime = expirationTime;
          if (alternate !== null && alternate.childExpirationTime < expirationTime) {
            alternate.childExpirationTime = expirationTime;
          }
        } else if (alternate !== null && alternate.childExpirationTime < expirationTime) {
          alternate.childExpirationTime = expirationTime;
        }
        if (node.return === null && node.tag === HostRoot) {
          root = node.stateNode;
          break;
        }
        node = node.return;
      }
    }
  
    if (enableSchedulerTracing) {
      if (root !== null) {
        var interactions = tracing.__interactionsRef.current;
        if (interactions.size > 0) {
          var pendingInteractionMap = root.pendingInteractionMap;
          var pendingInteractions = pendingInteractionMap.get(expirationTime);
          if (pendingInteractions != null) {
            interactions.forEach(function (interaction) {
              if (!pendingInteractions.has(interaction)) {
                // Update the pending async work count for previously unscheduled interaction.
                interaction.__count++;
              }
  
              pendingInteractions.add(interaction);
            });
          } else {
            pendingInteractionMap.set(expirationTime, new Set(interactions));
  
            // Update the pending async work count for the current interactions.
            interactions.forEach(function (interaction) {
              interaction.__count++;
            });
          }
  
          var subscriber = tracing.__subscriberRef.current;
          if (subscriber !== null) {
            var threadID = computeThreadID(expirationTime, root.interactionThreadID);
            subscriber.onWorkScheduled(interactions, threadID);
          }
        }
      }
    }
    return root;
  }
	function recordScheduleUpdate() {
    if (enableUserTimingAPI) {
      if (isCommitting) {
        hasScheduledUpdateInCurrentCommit = true;
      }
      if (currentPhase !== null && currentPhase !== 'componentWillMount' && currentPhase !== 'componentWillReceiveProps') {
        hasScheduledUpdateInCurrentPhase = true;
      }
    }
  }
	  
  function findCurrentUnmaskedContext(fiber) {
    // Currently this is only used with renderSubtreeIntoContainer; not sure if it
    // makes sense elsewhere
    !(isFiberMounted(fiber) && fiber.tag === ClassComponent) ? invariant(false, 'Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.') : void 0;
  
    var node = fiber;
    do {
      switch (node.tag) {
        case HostRoot:
          return node.stateNode.context;
        case ClassComponent:
          {
            var Component = node.type;
            if (isContextProvider(Component)) {
              return node.stateNode.__reactInternalMemoizedMergedChildContext;
            }
            break;
          }
      }
      node = node.return;
    } while (node !== null);
    invariant(false, 'Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.');
  }

	function ReactWork() {
	  this._callbacks = null;
    this._didCommit = false;
		this._onCommit = this._onCommit.bind(this);
	}

	ReactWork.prototype._onCommit = function () {
    if (this._didCommit) {
      return;
    }
    this._didCommit = true;
    var callbacks = this._callbacks;
    if (callbacks === null) {
      return;
    }
    // TODO: Error handling.
    for (var i = 0; i < callbacks.length; i++) {
      var _callback2 = callbacks[i];
      _callback2();
    }
  };

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
			console.info(root, '---root--------')
      unbatchedUpdates(function() {
        if (parentComponent !== null) {
          root.legacy_renderSubtreeIntoContainer(parentComponent, children, callback);
        } else {
          root.render(children, callback)
        }

      })
    }
	}
	
	function unbatchedUpdates(fn, a) {
    // if (isBatchingUpdates && !isUnbatchingUpdates) {
    //   isUnbatchingUpdates = true;
    //   try {
    //     return fn(a);
    //   } finally {
    //     isUnbatchingUpdates = false;
    //   }
    // }
    return fn(a);
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