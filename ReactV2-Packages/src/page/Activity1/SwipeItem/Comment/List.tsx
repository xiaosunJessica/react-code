import React from 'react';
import Item from './Item';
import styles from './index.module.less';

const List = React.memo(() => {
  return <div className={styles.list}><Item /></div>
})

export default List;