(function(){
  const transferVdomToDom = (vdom) =>{
    const child = vdom.props.children;
    if (!child.hasOwnProperty('type')) {
      return document.createTextNode(child)
    }
    if (typeof vdom.type === 'function') {
      // 函数组件和类组件2种
      const instance = new vdom.type();
      if (instance.isReactComponent) {
        // 类组件
        return transferClassToDom(vdom)
      } else {
        // 函数组件
      }
    }
  }

  const transferClassToDom = (vdom) => {
    console.info(vdom, '---vdomvdomvdom---')
  }
  const ReactDOM = {
    render: function(element, container, callback) {
      transferVdomToDom(element)
      container.appendChild(transferVdomToDom(element))
    }
  }
  module.exports = ReactDOM;
})()