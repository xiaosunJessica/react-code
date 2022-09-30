// import React, { useState } from "react";
// import {  Link } from "react-router-dom";
// function Comment() {
//   const [counts, setCounts] = useState(0);
//   const handleAdd = () => {
//     // const randomCount = Math.round(Math.random()*100)
//     // counts.push(randomCount)
//     // console.log(counts, 'countscountscounts')
//     // setCounts(counts)
//     setTimeout(() => {
//       alert('count:', count)
//     }, 1000)
//   }
//   console.log(counts, 'countscounts----')
//   return (
//     <div>
//       {counts.map((count) => (
//         <div key={count}>{count}</div>
//       ))}
//       <Link to="/b">B</Link>
//       <button onClick={handleAdd}>增加</button>
//     </div>
//   );
// }

// export default Comment;

import React, { PureComponent } from 'react'
import {Link} from "react-router-dom";
import B from '../B';
class A extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      test: 0
    }
  }

  componentWillMount(){
    console.log('componentWillMountAAA')
  }

  componentDidMount() {
    console.log('componentDidMountAAA')

  }

  componentWillUpdate() {
    console.log('componentWillUpdateAAA')
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdateAAA')
    // return false
    return true
  }

  componentDidUpdate() {
    console.log('componentDidUpdateAAA')
  }

  render() {
    console.log('----render---A')
    return <div>{this.props.value}
    <div onClick={() => {
      debugger;
      this.setState({
        test: Math.random()
      })
      console.log(123)
    }}>add</div>
    <Link to="/b">BB</Link>
    <B />
    </div>
  }
}

export default A