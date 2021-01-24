import React from '../../react/packages/react';
import ComA from './ComA';
import ComponentInput from './input';
export default class TestMemo extends React.Component{
  formData = {};
  render(){
      return <div>
          { /*  我们增加三个子组件 */ }
          <ComA />
          <div className="box" >
          <ComponentInput notifyFatherChange={ (value)=>{ this.formData.inputValue = value } }  /> 
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