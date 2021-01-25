import React from '../../react/packages/react';
class Index extends React.Component{
  state={
     list: []
  }
  handerClick=()=>{
     this.sliceTime(new Array(4000).fill(0), 0)
  }
  // sliceTime=(list,times)=>{
  //     if(times === 400) return 
  //     setTimeout(() => {
  //         const newList = list.slice( times , (times + 1) * 100 ) /* 每次截取 100 个 */
  //         this.setState({
  //             list: this.state.list.concat(newList)
  //         })
  //         this.sliceTime( list ,times + 1 )
  //     }, 0)
  // }
  sliceTime=(list,times)=>{
    console.log(times, '-----time-----')
    if(times === 10) return 
    window.requestAnimationFrame(() => {
      const newList = list.slice( times , (times + 1) * 100 ) /* 每次截取 100 个 */
      this.setState({
          list: this.state.list.concat(newList)
      })
      this.sliceTime( list ,times + 1 )
    })
  }
  
  render(){
      const { list } = this.state
      return <div>
          <button onClick={ this.handerClick } >点击</button>
          {
              list.map((item,index)=><li className="list"  key={index} >
                  { item  + '' + index } Item
              </li>)
          }
      </div>
  }
}

export default Index
