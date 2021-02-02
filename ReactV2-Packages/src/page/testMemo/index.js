import React from '../../react/packages/react';
import ComA from './ComA';
import ComponentInput from './input';
// export default class TestMemo extends React.Component{
//   formData = {};
//   render(){
//       return <div>
//           { /*  我们增加三个子组件 */ }
//           <ComA />
//           <div className="box" >
//           <ComponentInput notifyFatherChange={ (value)=>{ this.formData.inputValue = value } }  /> 
//           </div>
//           {/* 我们首先来一个列表循环 */}
//           {
//               new Array(10).fill(0).map((item,index)=>{
//                   console.log('列表循环了' )
//                   return <div key={index} >{item}</div>
//               })
//           }
//           {
//             /* 这里可能是更复杂的结构 */
//             /* ------------------ */
//           }
//       </div>
//   }
// }


// export default class TestMemo extends React.Component{
//   constructor(props){
//     super(props)
//     this.state={
//       inputValue:''
//     }
//   }
//   handerChange=(e)=> this.setState({ inputValue:e.target.value  })
//   render(){
//     const { inputValue } = this.state;
//       return <div>
//           { /*  我们增加三个子组件 */ }
//           <ComA />
//           <div className="box" >
//           <div className="box" >
//                 <input  value={inputValue}  onChange={ (e)=> this.handerChange(e) } />
//             </div>
//           </div>
//           {/* 我们首先来一个列表循环 */}
//           {
//               new Array(10).fill(0).map((item,index)=>{
//                   console.log('列表循环了' )
//                   return <div key={index} >{item}</div>
//               })
//           }
//           {
//             /* 这里可能是更复杂的结构 */
//             /* ------------------ */
//           }
//       </div>
//   }
// }



export default class TestMemo extends React.Component{
  constructor(props){
    super(props)
    this.state={
      inputValue: {
        a: 1
      }
    }
  }
  handerChange=(e)=> {
    const { inputValue } = this.state;
    inputValue.a = e.target.value
    this.setState({ inputValue })
  }
  render(){
    const { inputValue } = this.state;
    console.log(inputValue, ':e.target.value :e.target.value ' )
      return <div>
          { /*  我们增加三个子组件 */ }
          <ComA />
          <div className="box" >
          <div className="box" >
                <input  value={inputValue.a}  onChange={ (e)=> this.handerChange(e) } />
            </div>
          </div>
          {/* 我们首先来一个列表循环 */}
          {
              new Array(10).fill(0).map((item,index)=>{
                  console.log('列表循环了' )
                  return <div key={index} >{item}</div>
              })
          }
          {
            /* 这里可能是更复杂的结构 */
            /* ------------------ */
          }
      </div>
  }
}

