import React, { useEffect, useState } from 'react';


const App = () => {
  const [ count, setCount ] = useState(1);
  useEffect(() => {
    clickEvt()
  }, [])

  const clickEvt = () => {
    setCount(count+1)
  }
  return (
    <div onClick={clickEvt}>{count}</div>
  )
}

export default App;
