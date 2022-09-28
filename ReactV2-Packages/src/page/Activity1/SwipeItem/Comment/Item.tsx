import React from 'react';
import styles from './index.module.less';

const Item = React.memo(() => {

  return (
    <div>
      <div className={styles.item}>
        <div className={styles.avatar}>
          <img src="" />
        </div>
        <div className={styles.itemWrapper}>
          <div className={styles.header}>
            <div className={styles.useInfo}>
              <span className={styles.name}>
              陶文
              </span>
              <span className={styles.userCode}>
              （23098506）
              </span>
            </div>
            <div className={styles.type}>
              北京时间到付款时间啊开发
            </div>
          </div>
          <div className={styles.cmtContent}>
          周三，晨会（司歌，拍拍操）集中学习新楼盘，夕会复盘通关，学盘质量不高的安排一个人自己再去售楼部学习做算。
          </div>
          <div className={styles.footer}>
            <span className={styles.time}>1 天前</span>
            <span className={styles.reply}>回复</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Item;