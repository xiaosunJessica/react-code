import React, { useState } from "react";
import {  Link } from "react-router-dom";
function Comment() {
  const [counts, setCounts] = useState([1, 2]);
  const handleAdd = () => {
    const randomCount = Math.round(Math.random()*100)
    counts.push(randomCount)
    console.log(counts, 'countscountscounts')
    setCounts(counts)
  }
  console.log(counts, 'countscounts----')
  return (
    <div>
      {counts.map((count) => (
        <div key={count}>{count}</div>
      ))}
      <Link to="/b">B</Link>
      <button onClick={handleAdd}>增加</button>
    </div>
  );
}

export default Comment;