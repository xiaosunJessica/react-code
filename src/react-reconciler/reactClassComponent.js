
export const classComponentUpdater = {
  isMounted: {},
  enqueueSetState(inst, payload, callback) {
   
  },
  enqueueReplaceState(inst, payload, callback) {
    
  },
  enqueueForceUpdate(inst, callback) {
   
  },
};

const constructClassInstance = (workInProgress, Component, props) => {
  const instance = new Component(props, {});
  adoptClassInstance(workInProgress, instance)
}

export function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance;
}