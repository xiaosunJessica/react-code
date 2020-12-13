import React, { useEffect, useState } from 'react';


const App = () => {
  const [ count, setCount ] = useState(1);
  useEffect(() => {
    // clickEvt()
    setCount(2)
  }, [])

  // const clickEvt = () => {
  //   setCount(count+1)
  // }
  return (
    // <div onClick={clickEvt}>{count}</div>
    <div >{count}</div>
  )
}

export default App;
