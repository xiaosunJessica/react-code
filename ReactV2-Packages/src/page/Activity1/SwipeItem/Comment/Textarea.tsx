import React from 'react';
import { TextareaItem } from "antd-mobile";
import styles from './index.module.less';
const CommentTextarea = () => {
  return <div className={styles.commentTextarea}>
    <TextareaItem className={styles.textarea}  placeholder="写评论" />
  </div>
}

export default CommentTextarea;