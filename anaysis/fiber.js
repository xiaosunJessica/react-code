 //fiber
{
   // Instance
  // 主要是用于标记元素类型，hostRoot, classComponent
  this.tag = tag;
  // 唯一性标志，和jsx里的key一样
  this.key = key;
  // 生成实际DOM元素需要的标签，div,p
  this.elementType = null;
  // 虚拟DOM生成标志的类型，
  this.type = null;
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

  //当前需要更新的props
  this.pendingProps = pendingProps;
  // 记录之前的props
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  // legacy /concurrent/ hydrate等模式
  this.mode = mode;


  // Effects
  // 记录增删改查操作类型Placement/Update/Deletion
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 记录更新时间** 
  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null;

}