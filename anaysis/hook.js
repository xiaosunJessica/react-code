const hook = {
  // 上一次更新state，initialState或者effect结构
  memoizedState: null,

  // 当前更新state??
  baseState: null,
  // 更新队列，结构见下面的quene
  queue: null,
  baseUpdate: null,

  // 下一个操作的hook结构
  next: null,
};

const queue = (hook.queue = {
  last: null,
  dispatch: null,
  lastRenderedReducer: basicStateReducer,
  lastRenderedState: initialState,
});

queue.dispatch = dispatchAction.bind(null, fiber, queue)

const effect = {
  tag,
  // useEffect 第一个参数，执行函数
  create,
  destroy,
  // useEffect第二个参数， 数组
  deps,
  // Circular
  next: null,
};