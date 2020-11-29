 //fiber
{
   // Instance
  // 主要是用于标记元素类型，FunctionComponent=0/ClassComponent=1/IndeterminateComponent=2/HostRoot=3
  // 详细见文件ReactWorkTags
  this.tag = tag;
  // 唯一性标志，和jsx里的key一样
  this.key = key;
  // 虚拟DOM的type
  this.elementType = null;
  // 虚拟DOM生成标志的类型，
  this.type = null;

  // 在classComponent里是instance，在root里是rootFiber
  this.stateNode = null;

  // Fiber
  // 父节点的fiber
  this.return = null;
  // 第一个子节点的fiber
  this.child = null;
  // 下一个兄弟节点的fiber
  this.sibling = null;
  // 兄弟节点的位置
  this.index = 0;

  // JSX里带入的正常ref
  this.ref = null;

  // 当前需要更新的props
  this.pendingProps = pendingProps;
  // 记录之前的props
  this.memoizedProps = null;
  // 更新对象
  this.updateQueue = null;
  // 记录之前的state
  this.memoizedState = null;
  
  this.dependencies = null;

  // legacy noMode /concurrent/ StrictMode /ProfileMode/BatchedMode
  this.mode = mode;


  // Effects
  // 记录增删改查操作类型Placement/Update/Deletion
  this.effectTag = NoEffect;
  this.nextEffect = null;

  // 在commit里的finishWork有用到，从firstEffect开始执行到lastEffect结束
  // 在更新的时候，firstEffect到lasteEffect记录整个需要更新的链表结构
  this.firstEffect = null;
  this.lastEffect = null;

  // 记录更新时间** 
  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  // 当前节点, workInProgress是记录新数据的当前节点，alternate是保留上一次记录的当前节点，
  // 在更新时可以看到pendingProps之类的是不一样的
  this.alternate = null;

}