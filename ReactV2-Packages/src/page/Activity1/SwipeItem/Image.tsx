import React from 'react';
import styles from './image.module.less';
const Image = React.memo((props: {
  url: string
}) => {
  return <img className={styles.img} src={props.url} />
})

export default Image