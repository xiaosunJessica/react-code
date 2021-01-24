import React, { useEffect, useState, useMemo, useCallback, useLayoutEffect } from 'react';


const App = React.memo(() => {
  const [ count, setCount ] = useState(1);
  const [ name, setName ] = useState('sun');
  // useLayoutEffect(() => {
  //   // clickEvt()
  //   setCount(2)
  // }, [])
  // if (count === 2) {
  //   useEffect(() => {
  //     setName('ya')
  //   }, [])
  // }

  useEffect(() => {
    setTimeout(() => {console.log(count, 'countcountcount')}, 3000)
  }, [count])

  const clickEvt = () => {
    setCount(count+1)
  }
  return (
    <div onClick={clickEvt}>{count}</div>
    // <div >{count}{name}</div>
  )
})

export default App;
