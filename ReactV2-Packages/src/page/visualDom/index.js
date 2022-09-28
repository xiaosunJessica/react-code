import React from '../../react/packages/react';
import { useEffect, useRef, useState } from '../../react/packages/react/src/ReactHooks';
let num = 0;

const Index = () => {
  const [visualParams, setVisualParams ] = useState({
    list: new Array(999).fill(0).map(() => num++),
    scrollBoxHeight: document.body.clientHeight, // 容器初始化高度
    renderList: [], // 渲染列表
    itemHeight: document.body.clientHeight, // 每一个列表高度
    bufferCount: 8, // 缓冲个数 上下4个
    renderCount: 0,  //渲染数量
    start: 0, // 起始索引
    end: 0, // 终止索引
  })

  const listBox = useRef(null);
  const scrollBox = useRef(null);
  const scrollContent = useRef(null);

  useEffect(() => {
    console.log('--------useEffect')
    const { itemHeight, bufferCount } = visualParams;
    //计算容器高度
    const scrollBoxHeight = listBox.offsetHeight || 0;
    console.log(listBox.offsetHeight, 'listBoxlistBoxlistBox')
    const renderCount = Math.ceil(scrollBoxHeight/itemHeight) + bufferCount;
    const end = 10;
    setVisualParams(params => ({
      ...params,
      scrollBoxHeight,
      end,
      renderCount
    }))
  }, [!!listBox.offsetHeight])

  const handleScroll = () => {
    const { scrollTop } = scrollBox;
    const { itemHeight, renderCount } = visualParams;
    // console.log(scrollTop % itemHeight, 'scrollTop % itemHeight', scrollTop ,itemHeight)
    const currentOffset = scrollTop - (scrollTop % itemHeight);
    /** translate3d 开启CSS CPU 加速 */
    scrollContent.style.transform = `translate3d(0, ${scrollTop}px, 0)`
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.floor(scrollTop / itemHeight + renderCount + 1)
    setVisualParams(params => ({
      ...params,
      start,
      end,
    }))
  }

  const { list, scrollBoxHeight, itemHeight, start, end } = visualParams
  const renderList = list.slice(start, end);
  console.log(list, '--list-----', start, end)
  return (
    <div 
      className="list_box"
      ref={listBox}>
      <div
        style={{ height: scrollBoxHeight, overflow: 'scroll', position: 'relative'}}
        ref={scrollBox}
        onScroll={handleScroll}>
        {/*占位作用 */}
        <div style={{ height: `${list.length * itemHeight}px`, position: 'absolute', left: 0, top: 0, right: 0}}></div>

        {/*显示区 */}
        <div ref={scrollContent} style={{ position: 'relative', left: 0, top: 0, right: 0}}>
          {
            renderList.map((item, index) => (
              <div className="list" key={index}>
                {item + ''}Item
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}


export default Index;