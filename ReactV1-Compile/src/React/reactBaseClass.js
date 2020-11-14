

/**
 * This is the abstract API for an update queue.
 *  updater
 */

function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.updater = updater;
}
 
Component.prototype.isReactComponent = {}

Component.prototype.setState = function(partialState, callback) {
  // debugger;
  this.updater.enqueueSetState(this, partialState, callback, 'setState')
}

Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
}

export { Component }