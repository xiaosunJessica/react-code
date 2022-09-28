import React, { useMemo, useState, useRef, useEffect } from 'react';
import styles from './index.module.less';
import MockData from './mock.json';
import SwipeItem from '../SwipeItem';
import activity1Service from 'services/activity1.service';
const clientHeight = document.documentElement.clientHeight;

type ActivityListData = {
  areaCode: string;
  attachmentList: any[]
  endTime: number
  id: number
  location: string
  name: string;
  stat: {
    activityId: number; 
    scoreNum: number; 
    commentNum: number; 
    forwardNum: number; 
    status: number;
  }
  summary: string;
  type: string;
}

const pageNo = 3
const SwipeContainer = function() {

  // 用于全局记录当前滚动到的数据
  const globalDataIdx = useRef(0)


  // 获取主要容器的DOM
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // 缓存列表
  const [ dataList, setDataList ] = useState<{
    cacheList: any[], // 缓存数据
    showList: any[], // 展示列表数据
    hasMore: boolean;
  }>({
    cacheList: [],
    showList: [],
    hasMore: true
  })
 

  // 加载更多
  const loadMore = async () => {
    if (!dataList.hasMore) return;
    try {
      // if (page === allPage) return
      const res: ActivityListData[] = await activity1Service.fetchActivity1List({
        tab: 0,
        areaCode: '',
        page: 1,
      })
      if (Array.isArray(res)) {
        const _dataList = dataList.cacheList.concat(_combine(res))
        setDataList(params => {
          return ({...params, cacheList: _dataList, showList: _dataList, hasMore: !!res.length})
        });
      }
      
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    animationInit()
  }, [dataList])
  // 整个容器的手指触发事件
  const { touchStart, touchMove, touchEnd } = useMemo(() => {
    let canMove = true;
    let startPos: {
      x: number;
      y: number
    } | null = null;
    const touchStart = (event) => {
      if (!canMove) return;
      canMove = true;
      startPos = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
      }
      console.log(startPos)
    }

    // 开始滑动
    const touchMove = (event) => {
      console.log(globalDataIdx.current, 'globalDataIdx.currentglobalDataIdx.current')
      if (!startPos) return;
      let posY = event.changedTouches[0].pageY
      let distance = posY - (startPos ? startPos.y : 0)
      if (!sliderContainerRef.current) return;
      const slideItem = (sliderContainerRef?.current as any)?.children;
   
      // const idx = Number(event?.target?.getAttribute('data-slideIdx'));
      const idx = globalDataIdx.current || 0;
      
      // console.log(event?.target, 'distancedistancedistancedistance', event?.target?.getAttribute('data-slideIdx'))
      if (distance > 0) {
        // 向下滑动 => 下拉刷新
        if (idx === 0) {
          distance = distance > 75 ? 75 : distance
          sliderContainerRef.current.style.transform = `translate3d(0,${distance}px,0)`
          setTimeout(() => {
            if (sliderContainerRef.current) {
              sliderContainerRef.current.style.transform = `translate3d(0,0,0)`
            }
          }, 100)
        } else {
          distance = distance - clientHeight;
          let pre = idx - 1;
          if (pre < 0) return;
          slideItem[pre].style.transform = `translate3d(0, ${distance}px, 0)`
        }
      } else {
        // 向上滑动
        if (globalDataIdx.current === dataList.showList.length - 1) return
        let next = idx + 1;
        // 下一个列表慢慢冒出来效果
        if (slideItem[next]) {
          distance = clientHeight + distance
          slideItem[next].style.transform = `translate3d(0,${distance}px,0)`
        }
      }
    }
    const touchEnd = (event) => {
      if (!startPos || !sliderContainerRef.current) return;
      let pos = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY
      }
      let distanceX = pos.x - startPos.x
      let distanceY = pos.y - startPos.y
      let horizontal = Math.abs(distanceX) >= Math.abs(distanceY)
      // const idx = Number(event.target.getAttribute('data-slideIdx'))
      const idx = globalDataIdx.current || 0
      // let slideItem = (sliderContainerRef?.current as any)?.children
      if (horizontal) {
        // 横向滚动
        if (Math.abs(distanceX) < 40) return;
        let index = dataList.showList[idx].index || 0;
        if (distanceX <= -40) {
          index = (index === (dataList.showList[idx]?.list?.length - 1)) ? index : index + 1
        }
        if (distanceX >= 40) {
          index = index > 0 ? index - 1 : 0;
        }
        const _showList = JSON.parse(JSON.stringify(dataList.showList));
        _showList[idx].index = index;
        setDataList(params => ({...params, showList: _showList}))
        sliderContainerRef.current.style.transform = `translate3d(0, 0, 0)`;
      } else {
        // 纵向滚动
        // 高度不超过40 return
        if (Math.abs(distanceY) < 40) {
          animationInit()
          sliderContainerRef.current.style.transform = `translate3d(0,0,0)`
          return
        }

        // 高度超过40
        if (distanceY >= 40) {
          //向上滚动
          // if (globalDataIdx.current === 0) {
          //   //操作第一个
          //   return
          // }

          //回退上一个
          globalDataIdx.current = (idx - 1) < 0 ? 0 : idx - 1;
          animationInit()
        }

        if (distanceY <= -40) {
          // 向下滚动
          // 滚动到最后一个
          if (globalDataIdx.current === dataList.showList.length - 1) {
            // setRefresh((params) => ({
            //   ...params,
            //   showNoMore: true,
            // }))
          } else {
            // 预加载下一个列表数据
            globalDataIdx.current = (idx === dataList.showList.length) ? dataList.showList.length : (idx + 1);
            // 小于globalDataIdx为负数，等于的为0展示，大于的为正数
            // slideItem[Number(idx) + 1].style.transform = `translate3d(0, 0, 0)`
            animationInit()
            if (dataList.showList.length - globalDataIdx.current === 2 ) {
              loadMore();
            }
          }
        }
        sliderContainerRef.current.style.transform = `translate3d(0,0,0)`;
      }
      startPos = null;
    }

    return {
      touchStart,
      touchMove,
      touchEnd
    }
  }, [dataList])

  // 模拟异步数据
  const mockData = (pageNo, pageSize) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const _data = JSON.parse(JSON.stringify(MockData));
        console.log(pageNo, pageNo + pageSize, _data.data.data)
        _data.data.data = _data.data.data.slice(pageNo, pageNo + pageSize)
        resolve(_data)
      }, 400)
    })
  }

  // 接口调整后,整合数据
  const _combine = (data) => {
    return data.map((item) => {
      const { stat } = item;
      console.log(item.attachmentList, 'item.attachmentListitem.attachmentListitem.attachmentList')
      return Object.assign({}, item, {
        "title": item.name,
        "address": item.location,
        "avatar": "http://hytx-upload-images.oss-cn-beijing.aliyuncs.com/hytx/images/190216/1550309603269_141809.jpeg",
        "list": item.attachmentList ? item.attachmentList.map((attach, idx) => ({
          ...attach,
          index: idx
        })) : [],
        "content": item.summay,
        "score": (stat.scoreNum || stat.scoreTotal) ? Number(stat.scoreTotal/stat.scoreNum).toFixed(2) : 0,
        "type": item.typeName && item.typeName.split('#'),
      })
    })
  }

  const animationInit = () => {
    // console.log(globalDataIdx.current, 'globalDataIdx.currentglobalDataIdx.current')
    let slideItem = (sliderContainerRef?.current as any)?.children;
    // 按顺序，下面的全部隐藏
    for (let i = 0; i < slideItem.length; i++) {
      const num = (i - globalDataIdx.current) * 100;
      slideItem[Number(i)].style.transform = `translate3d(0, ${num}%, 0)`
      slideItem[Number(i)].style.zIndex = num === 0 ? 1 : 2;
    }
    // if (slideItem.length === 3) {
    //   slideItem[1].style.cssText = 'z-index: 1'
    //   slideItem[0].style.cssText =
    //     'z-index: 2;transform: translate3d(0,-100%,0);'
    //   slideItem[2].style.cssText =
    //     'z-index: 2;transform: translate3d(0,100%,0);'
    // } else if (slideItem.length === 2) {
    //   if (this.spreadIndex === 0) {
    //     slideItem[0].style.cssText = 'z-index: 1'
    //     slideItem[1].style.cssText =
    //       'z-index: 2;transform: translate3d(0,100%,0);'
    //   } else if (this.spreadIndex === this.spreads.length - 1) {
    //     slideItem[1].style.cssText = 'z-index: 1'
    //     slideItem[0].style.cssText =
    //       'z-index: 2;transform: translate3d(0,-100%,0);'
    //   }
    // }
  }

  const init = async () =>{
    try {
      loadMore();
      animationInit();
    } catch (err) {
      console.log(err)
    }
  }



  useEffect(() => {
    init();
  }, [])
  return (
    <div 
      className={styles.swipeContainer} 
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}>
      {/* 刷新文案展示 */}
      {/* {
        !!refresh && 
        <div className={styles.refresh}>
          正在刷新。。。
        </div>
      } */}
      {/* 主要的容器区域 */}
      <div className={styles.sliderContainer} ref={sliderContainerRef}>
        {
          useMemo(() => dataList.showList.map((data: any, index) => {
            return (
              <div className={styles.slickSlide} data-slideIdx={index}>
                <SwipeItem {...data} slideIdx={index} />
              </div>
            )
          }), [dataList])
        }
      </div>

      {/* 没有数据展示 */}
      {/* {
        !!showNoMore && 
        <div className={styles.noMore}>
          没有更多了
        </div>
      } */}

    </div>
  )
}

export default SwipeContainer;