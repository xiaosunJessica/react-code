import React from 'react';
import List from './List';
import Input from './Textarea';
import styles from './index.module.less';
import { useComment } from './hooks';
const Comment = React.memo((props: {
  setShowComment: Function;
}) => {
  const { onShowComment } = useComment(props)
  return (
    <div className={styles.comment}>
      <div className={styles.cmtWrapper}>
        <div className={styles.header}>
          <p>活动评论（400）</p>
          <div className={styles.close} onClick={onShowComment}>X</div>
        </div>
        <List />
        <Input />
      </div>
    </div>
  )
})

export default Comment;