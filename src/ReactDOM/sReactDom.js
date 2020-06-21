
(function(){
  var stylesFunction = require('./cssPropertyOperation');
  function shouldConstruct(Component) {
    var prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent);
  }
  const updateContainer = (vdom) =>{
		// 文本节点
    if (typeof vdom === 'string') {
      return document.createTextNode(vdom);
		}
		// html 标签
    if (typeof vdom.type === 'string') {
      return createElement(vdom)
		}
		// 组件
    if (typeof vdom.type === 'function') {
      // 函数组件和类组件2种
      if (shouldConstruct(vdom.type)) {
				const instance = new vdom.type(vdom.props);
        const _vdom = instance.render();
        // 类组件
        // 实例化Component updateClassComponent - constructClassInstance
        return updateClassComponent(_vdom)
      } else {
        // 函数组件
        return updateFunctionComponent(vdom.type(vdom.props))
      }
    }
  }

  const createElement = (vdom) => {
    const element = document.createElement(vdom.type);
		const { children } = vdom.props;
    if (Array.isArray(children)) {
      children.forEach((child) => {
        element.appendChild(updateContainer(child))
			})	
    } else {
			if (typeof children === 'string' || typeof children === 'number') {
				element.appendChild(document.createTextNode(children))
			}
			if (typeof children === 'object') {
				element.appendChild(updateContainer(children))
			}
		}
		// 不可采用es6的结构...
		for (var propKey in vdom.props) {
			if (propKey.startsWith('on')) {
				element[propKey.toLowerCase()] = vdom.props[propKey]
			}
			if (propKey === 'style') {
				stylesFunction.setValueForStyles(element, vdom.props[propKey])
			}
		}
		
		
    return element;
  }

  const updateClassComponent = (vdom) => {
    return updateContainer(vdom)
  }

  const updateFunctionComponent = (vdom) => {
    return updateContainer(vdom)
  }
  const ReactDOM = {
    render: function(element, container, callback) {
      updateContainer(element)
      // container.innerHTML = `<pre>${JSON.stringify(element, null, 2)}</pre>`
      container.appendChild(updateContainer(element))
    }
  }

  let ReactDOM$2 = Object.freeze({
    default: ReactDOM
  })

  var ReactDOM$3 = ( ReactDOM$2 && ReactDOM ) || ReactDOM$2;
  
  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.
  var reactDom = ReactDOM$3.default || ReactDOM$3;
  
  module.exports = reactDom;
})()


