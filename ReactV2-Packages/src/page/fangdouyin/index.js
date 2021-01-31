/*
 * @Author: your name
 * @Date: 2021-01-27 15:08:52
 * @LastEditTime: 2021-01-27 15:09:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mcg-circle-fe/client/src/pages/Activity1/index.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import SwipeContainer from './SwipeContainer';
import styles from './index.module.less';

const Activity1 = function() {
  const [{
    scrolled,
    scrollHeight,
    windowHeight,
  }, setParams] = useState({
    scrolled: 0,
    scrollHeight: 0,
    windowHeight: 0,
  })

  const scrollHandler = useCallback(() => {
    let scrolled = document.documentElement.scrollTop || document.body.scrollTop
    this.scrollHeight = document.documentElement.scrollHeight
    let windowHeight = document.documentElement.clientHeight
    let updateWindowHeight = this.windowHeight === windowHeight
    this.windowHeight = updateWindowHeight ? this.windowHeight : windowHeight
    if (this.header && this.header.style.display !== 'none') {
      this.header.style.position = 'fixed'
    }
    if (this.footer && this.footer.style.display !== 'none') {
      this.footer.style.position = 'fixed'
    }
    this.scrolled = scrolled
    this.$emit('scrolling', scrolled, this.scrollHeight)
    this.$emit('isButton', scrolled + this.windowHeight >= this.scrollHeight)
  }, [])

  useEffect(() => {
    setParams((params) => ({
      ...params,
      windowHeight: document.documentElement.clientHeight
    }))
    window.removeEventListener('scroll', scrollHandler, false)
    return () => {
      window.removeEventListener('scroll', scrollHandler, false)
    }
  }, [])

  return (
    <div className={styles['activity-container']}>
      <SwipeContainer />
    </div>
  )
}

export default Activity1;
