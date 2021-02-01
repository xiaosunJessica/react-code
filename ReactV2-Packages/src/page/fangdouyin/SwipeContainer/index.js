import React, { useMemo, useState, useRef, useEffect } from 'react';
import styles from './index.module.less';
import MockData from './mock.json';
const clientHeight = document.documentElement.clientHeight;
const SwipeContainer = function() {

  // 用于全局记录当前滚动到的数据
  const globalDataIdx = useRef(0)
  // 设置刷新和无数据的参数
  const [{
    refresh,
    showNoMore,
  }, setRefresh] = useState({
    refresh: false,
    showNoMore: false
  })

  // 获取主要容器的DOM
  const sliderContainerRef = useRef(null);

  // 获取列表数据
  const [ dataList, setDataList ] = useState([])

  // 加载更多
  const loadMore = async () => {
    try {
      // if (page === allPage) return
      let res = await mockData()
      if (res.status !== 0) throw new Error(res.message)
      const _dataList = dataList.concat(_combine(res))
      console.log(_dataList, '------_dataList_dataList')
      setDataList(_dataList)
    } catch (err) {
      console.log(err)
    }
  }
  // 整个容器的手指触发事件
  const { touchStart, touchMove, touchEnd } = useMemo(() => {
    let canMove = true;
    let startPos = null;
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
      if (!startPos) return;
      let posY = event.changedTouches[0].pageY
      let distance = posY - (startPos ? startPos.y : 0)
      if (!sliderContainerRef.current) return;
      const slideItem = sliderContainerRef.current.children;
   
      const idx = event.target.getAttribute('data-index')
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
          distance = - clientHeight + distance
          slideItem[0].style.transform = `translate3d(0,${distance}px,0)`
        }
      } else {
        // 向上滑动
        if (globalDataIdx.current === dataList.length - 1) return
        let next = Number(idx) + 1;
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
      console.log(horizontal, 'horizontalhorizontal')
      let slideItem = sliderContainerRef.current.children
      if (horizontal) {
        // 横向滚动
        sliderContainerRef.current.style.transform = `translate3d(0,0,0)`;
      } else {
        // 纵向滚动

        console.log(distanceY, 'distanceYdistanceY')
        // 高度不超过40 return
        if (Math.abs(distanceY) < 40) {
          animationInit()
          sliderContainerRef.current.style.transform = `translate3d(0,0,0)`
          return
        }

        // 高度超过40
        if (distanceY >= 40) {
          //向上滚动
        }

        if (distanceY <= -40) {
          // 向下滚动
          // 滚动到最后一个
          if (globalDataIdx.current === dataList.length - 1) {
            setRefresh((params) => ({
              ...params,
              showNoMore: true,
            }))
          } else {
            // 预加载下一个列表数据
            if (dataList.length - globalDataIdx.current === 3 ) {
              loadMore();
            }
          }
        }
      }
      startPos = null;
    }

    return {
      touchStart,
      touchMove,
      touchEnd
    }
  }, [])

  // 模拟异步数据
  const mockData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MockData)
      }, 400)
    })
  }

  // 接口调整后,整合数据
  const _combine = (res) => {
    let cards = res.data.cards
    let spread = res.data.data.data
    let marketing = res.data.marketing
    let enterprise = res.data.enterprise
    spread = spread.map(item => {
      if (item.type === 1 && enterprise[item.user_id]) {
        // 企业
        item.motto = enterprise[item.user_id].name
        item.head_picture = enterprise[item.user_id].logo
      } else if (cards[item.card_id]) {
        // 个人
        item.motto = cards[item.card_id].motto
        item.head_picture = cards[item.card_id].head_picture
      }
      item.user_marketing_title = item.user_marketing_id
        ? marketing[item.user_marketing_id].title
        : null
      return item
    })
    return spread
  }

  const animationInit = () => {
    let slideItem = sliderContainerRef.current.children;
    // 按顺序，下面的全部隐藏
    if (slideItem.length === 3) {
      slideItem[1].style.cssText = 'z-index: 1'
      slideItem[0].style.cssText =
        'z-index: 2;transform: translate3d(0,-100%,0);'
      slideItem[2].style.cssText =
        'z-index: 2;transform: translate3d(0,100%,0);'
    } else if (slideItem.length === 2) {
      if (this.spreadIndex === 0) {
        slideItem[0].style.cssText = 'z-index: 1'
        slideItem[1].style.cssText =
          'z-index: 2;transform: translate3d(0,100%,0);'
      } else if (this.spreadIndex === this.spreads.length - 1) {
        slideItem[1].style.cssText = 'z-index: 1'
        slideItem[0].style.cssText =
          'z-index: 2;transform: translate3d(0,-100%,0);'
      }
    }
  }

  const init = async () =>{
    try {
      let res = await mockData()
      if (res.status !== 0) throw new Error(res.message)
      let _dataList = _combine(res)
      if (_dataList.length) {
        _dataList[0].browse_num = _dataList[0].browse_num + 1
      }

      setRefresh((params) => ({
        ...params,
        refresh: false
      }))

      setDataList(_dataList)
      animationInit()
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
      {
        !!refresh && 
        <div className={styles.refresh}>
          正在刷新。。。
        </div>
      }
      {/* 主要的容器区域 */}
      <div className={styles.sliderContainer} ref={sliderContainerRef}>
        {
          dataList.map((data, index) => {
            return (
              <div className={styles.slickSlide} data-index={index}><span>{data.title}</span><div>{index}</div></div>
            )
          })
        }
      </div>

      {/* 没有数据展示 */}
      {
        !!showNoMore && 
        <div className={styles.noMore}>
          没有更多了
        </div>
      }

    </div>
  )
}

export default SwipeContainer;