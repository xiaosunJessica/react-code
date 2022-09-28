import React from '../../react/packages/react';
let num = 0;
let height = 667
class Index extends React.Component{
  state = {
    list: new Array(9999).fill(0).map(() => num++),
    scrollBoxHeight: height, // 容器初始化高度
    renderList: [], // 渲染列表
    itemHeight: height, // 每一个列表高度
    bufferCount: 8, // 缓冲个数 上下4个
    renderCount: 0,  //渲染数量
    start: 0, // 起始索引
    end: 0, // 终止索引
  }
  listBox = null;
  scrollBox = null;
  scrollContent = null;
  componentDidMount() {
    const { itemHeight, bufferCount } = this.state;
    //计算容器高度
    const scrollBoxHeight = this.listBox.offsetHeight;
    const renderCount = Math.ceil(scrollBoxHeight/itemHeight) + bufferCount;
    const end = renderCount + 1;
    this.setState({
      scrollBoxHeight,
      end,
      renderCount
    })
  }

  handleScroll = () => {
    const { scrollTop } = this.scrollBox;
    const { itemHeight, renderCount } = this.state;
    // console.log(scrollTop % itemHeight, 'scrollTop % itemHeight', scrollTop ,itemHeight)
    const currentOffset = scrollTop - (scrollTop % itemHeight);
    /** translate3d 开启CSS CPU 加速 */
    this.scrollContent.style.transform = `translate3d(0, ${scrollTop}px, 0)`
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.floor(scrollTop / itemHeight + renderCount + 1)
    this.setState({
      start,
      end,
   })
  }

  /* 性能优化：只有在列表start 和 end 改变的时候在渲染列表 */
  shouldComponentUpdate(_nextProps, _nextState){
      const { start , end } = _nextState
      return start !== this.state.start || end !==this.state.end 
  }
  render(){
    const { list, scrollBoxHeight, itemHeight, start, end } = this.state
    const renderList = list.slice(start, end);
    return (
      <div 
        className="list_box"
        ref={(node) => this.listBox = node}>
        <div
          style={{ height: scrollBoxHeight, overflow: 'scroll', position: 'relative'}}
          ref={(node) => this.scrollBox = node}
          onScroll={this.handleScroll}>
          {/*占位作用 */}
          <div style={{ height: `${list.length * itemHeight}px`, position: 'absolute', left: 0, top: 0, right: 0}}></div>

          {/*显示区 */}
          <div ref={(node) => this.scrollContent = node} style={{ position: 'relative', left: 0, top: 0, right: 0}}>
            {
              renderList.map((item, index) => (
                <div className="list" key={index} style={{ height: `${this.state.itemHeight}px`}}>
                  {item + ''}Item
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Index;