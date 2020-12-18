import React, { useEffect, useState, useMemo, useCallback } from 'react';


const App = React.memo(() => {
  const [ count, setCount ] = useState(1);
  useEffect(() => {
    clickEvt()
  }, [])

  const clickEvt = useCallback(() => {
    setCount(count+1)
  }, [])
  return (
    <div onClick={clickEvt}>{count}</div>
  )
})

export default App;
