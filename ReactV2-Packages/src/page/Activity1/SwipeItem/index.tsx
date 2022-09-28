import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import { SwipeItemProps } from '../index';
import VideoCmpt from './Video';
import Image from './Image';
import Comment from './Comment';
import {useComment} from './Comment/hooks';
const clientWidth = document.documentElement.clientWidth;
interface SwipeItemCompProps extends SwipeItemProps {
  slideIdx: number
}
const FooterContainer = (props: SwipeItemCompProps) => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.address}>
        <span className={styles.iconAddress} />
        <span>{props.address}</span>
        <span>{props.createTime}</span>
      </div> 
      <div className={styles.title}>
        {props.title}
      </div> 
      <div className={styles.type}>
        {props.type}
      </div>
      <div className={styles.content}>
        {props.content}
      </div>
    </div>
  )
}

const RightContainer = (props: SwipeItemCompProps & {
  setShowComment: Function
}) => {
  const { onShowComment } = useComment(props)
  return (
    <div className={styles.rightContainer}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          <img src={props.avatar} />
        </div>
        <label>已关注</label>
      </div>
      <div className={styles.scoreWrapper}>
        <div className={styles.score}>{props.score}</div>
      </div>
      <div className={styles.commentWrapper} onClick={onShowComment}>
        <div className={styles.iconComment} />
        <div className={styles.label}>评论</div>
      </div>
      <div className={styles.shareWrapper}>
        <div className={styles.iconShare} />
        <div className={styles.label}>分享</div>
      </div>
    </div>
  )
}

const ListContainer = (props: SwipeItemCompProps) => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    try {
      // let _list = JSON.parse();
      setList(props.list)
    } catch (error) {
      
    }
  }, [props.list])
  return (
    <div className={styles.mainContainer}>
      <div className={styles.list} style={{width: `${list.length * clientWidth/100}rem`, transform: `translate3d(-${props.index * clientWidth/100}rem, 0, 0)`}}>
        {
          useMemo(() => list?.map((l: any) => {
            return (
              <div className={styles.item} style={{width: `${clientWidth/100}rem`}}>
                <div className={styles.imgWrapper}>
                  {
                    l.video ? <VideoCmpt url={l.video} /> :
                    <Image url={l.image} />
                  }
                </div>
              </div>
            )
          }), [list])
        }
      </div>
    </div>
  )
}
const SwipeItem = (props: SwipeItemCompProps) => {
  const [ showComment, setShowComment ] = useState<boolean>(false);
  return (
    <div className={styles.swipeItem}>
      <ListContainer {...props} />
      <RightContainer {...props} setShowComment={setShowComment} />
      <FooterContainer {...props}/>
      {
        !!showComment && 
        <Comment setShowComment={setShowComment} />
      }
    </div>
  )
}

export default SwipeItem;