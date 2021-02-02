import React, { useState } from '../../react/packages/react';

const Param = () => {
  const [ count, setCount ] = useState(0);

  function showClick(){
    setTimeout(function(){
      alert(count)
    }, 1000)
  }

  return (
    <div>
      <p> count的值{count}</p>
      <button onClick={() => setCount(count + 1)}>点我</button>
      <button onClick={showClick}>showClick</button>
    </div>
  )
}

export default Param;

// https://blog.csdn.net/frontend_frank/article/details/104243286