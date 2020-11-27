let update = {
  // 操作优先级
  priority,
  expirationTime,
  suspenseConfig,


  tag: UpdateState,
  // 要更新的内容，element, props
  payload: null,

  callback: null,

  next: null,
  nextEffect: null,
};

let updateQueue = {
  //应用更新后的state
  baseState,
  //队列中的第一个update
  firstUpdate: null,
  //队列中的最后一个update
  lastUpdate: null,
  //队列中第一个捕获类型的update
  firstCapturedUpdate: null,
  //队列中最后一个捕获类型的update
  lastCapturedUpdate: null,
  //第一个side effect
  firstEffect: null,
  //最后一个side effect
  lastEffect: null,
  firstCapturedEffect: null,
  lastCapturedEffect: null,
}