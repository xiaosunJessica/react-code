function createElement(type, config, children) {
  var propName = void 0;
  var props = {};
  var key = null;

  if (config != null) {
    for (propName in config) {
      props[propName] = config[propName];
    }
  }

  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: Symbol.for('react.element'),

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: null,
    props: props,

    // Record the component responsible for creating this element.
  };
  return element
}

export function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.updater = updater;
  console.info(this.updater)
}

Component.prototype.isReactComponent = {}

Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState')
}

Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
}

export default { createElement }