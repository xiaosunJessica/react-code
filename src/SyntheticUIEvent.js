
	var _assign = require('object-assign');
	var constant = require('./contant');
	var util = require('./util');
	const { normalizeKey, translateToKey} = constant;

	var previousScreenX = 0;
  var previousScreenY = 0;
  // Use flags to signal movementX/Y has already been set
  var isMovementXSet = false;
	var isMovementYSet = false;
	
	var EVENT_POOL_SIZE = 10;
	
	function getPooledWarningPropertyDefinition(propName, getVal) {
		var isFunction = typeof getVal === 'function';
		return {
			configurable: true,
			set: set,
			get: get
		};
	
		function set(val) {
			var action = isFunction ? 'setting the method' : 'setting the property';
			warn(action, 'This is effectively a no-op');
			return val;
		}
	
		function get() {
			var action = isFunction ? 'accessing the method' : 'accessing the property';
			var result = isFunction ? 'This is a no-op function' : 'This is set to null';
			warn(action, result);
			return getVal;
		}
	
		function warn(action, result) {
			var warningCondition = false;
			!warningCondition ? console.info(false, "This synthetic event is reused for performance reasons. If you're seeing this, " + "you're %s `%s` on a released/nullified synthetic event. %s. " + 'If you must keep the original synthetic event around, use event.persist(). ' + 'See https://fb.me/react-event-pooling for more information.', action, propName, result) : void 0;
		}
	}

	  
  function getPooledEvent(dispatchConfig, targetInst, nativeEvent, nativeInst) {
    var EventConstructor = this;
    if (EventConstructor.eventPool.length) {
      var instance = EventConstructor.eventPool.pop();
      EventConstructor.call(instance, dispatchConfig, targetInst, nativeEvent, nativeInst);
      return instance;
    }
    return new EventConstructor(dispatchConfig, targetInst, nativeEvent, nativeInst);
  }
  
  function releasePooledEvent(event) {
    var EventConstructor = this;
    !(event instanceof EventConstructor) ? console.info(false, 'Trying to release an event instance into a pool of a different type.') : void 0;
    event.destructor();
    if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
      EventConstructor.eventPool.push(event);
    }
  }

	function addEventPoolingTo(EventConstructor) {
    EventConstructor.eventPool = [];
    EventConstructor.getPooled = getPooledEvent;
    EventConstructor.release = releasePooledEvent;
	}

	function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
		{
			// these have a getter/setter for warnings
			delete this.nativeEvent;
			delete this.preventDefault;
			delete this.stopPropagation;
			delete this.isDefaultPrevented;
			delete this.isPropagationStopped;
		}
	
		this.dispatchConfig = dispatchConfig;
		this._targetInst = targetInst;
		this.nativeEvent = nativeEvent;
	
		var Interface = this.constructor.Interface;
		for (var propName in Interface) {
			if (!Interface.hasOwnProperty(propName)) {
				continue;
			}
			{
				delete this[propName]; // this has a getter/setter for warnings
			}
			var normalize = Interface[propName];
			if (normalize) {
				this[propName] = normalize(nativeEvent);
			} else {
				if (propName === 'target') {
					this.target = nativeEventTarget;
				} else {
					this[propName] = nativeEvent[propName];
				}
			}
		}
	
		var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
		if (defaultPrevented) {
			this.isDefaultPrevented = functionThatReturnsTrue;
		} else {
			this.isDefaultPrevented = functionThatReturnsFalse;
		}
		this.isPropagationStopped = functionThatReturnsFalse;
		return this;
	}
	
	SyntheticEvent.extend = function (Interface) {
		var Super = this;
	
		var E = function () {};
		E.prototype = Super.prototype;
		var prototype = new E();
	
		function Class() {
			return Super.apply(this, arguments);
		}
		_assign(prototype, Class.prototype);
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
	
		Class.Interface = _assign({}, Super.Interface, Interface);
		Class.extend = Super.extend;
		addEventPoolingTo(Class);
	
		return Class;
	};

	var SyntheticUIEvent = SyntheticEvent.extend({
		view: null,
		detail: null
	});
	
	var modifierKeyToProp = {
		Alt: 'altKey',
		Control: 'ctrlKey',
		Meta: 'metaKey',
		Shift: 'shiftKey'
	};
	var EventInterface = {
    type: null,
    target: null,
    // currentTarget is set when dispatching; no use in copying it here
    currentTarget: function () {
      return null;
    },
    eventPhase: null,
    bubbles: null,
    cancelable: null,
    timeStamp: function (event) {
      return event.timeStamp || Date.now();
    },
    defaultPrevented: null,
    isTrusted: null
  };
  
  function functionThatReturnsTrue() {
    return true;
  }
  
  function functionThatReturnsFalse() {
    return false;
	}

	function modifierStateGetter(keyArg) {
    var syntheticEvent = this;
    var nativeEvent = syntheticEvent.nativeEvent;
    if (nativeEvent.getModifierState) {
      return nativeEvent.getModifierState(keyArg);
    }
    var keyProp = modifierKeyToProp[keyArg];
    return keyProp ? !!nativeEvent[keyProp] : false;
  }
  
  function getEventModifierState(nativeEvent) {
    return modifierStateGetter;
  }
	


_assign(SyntheticEvent.prototype, {
	preventDefault: function () {
		this.defaultPrevented = true;
		var event = this.nativeEvent;
		if (!event) {
			return;
		}

		if (event.preventDefault) {
			event.preventDefault();
		} else if (typeof event.returnValue !== 'unknown') {
			event.returnValue = false;
		}
		this.isDefaultPrevented = functionThatReturnsTrue;
	},

	stopPropagation: function () {
		var event = this.nativeEvent;
		if (!event) {
			return;
		}

		if (event.stopPropagation) {
			event.stopPropagation();
		} else if (typeof event.cancelBubble !== 'unknown') {
			// The ChangeEventPlugin registers a "propertychange" event for
			// IE. This event does not support bubbling or cancelling, and
			// any references to cancelBubble throw "Member not found".  A
			// typeof check of "unknown" circumvents this issue (and is also
			// IE specific).
			event.cancelBubble = true;
		}

		this.isPropagationStopped = functionThatReturnsTrue;
	},

	/**
	 * We release all dispatched `SyntheticEvent`s after each event loop, adding
	 * them back into the pool. This allows a way to hold onto a reference that
	 * won't be added back into the pool.
	 */
	persist: function () {
		this.isPersistent = functionThatReturnsTrue;
	},

	/**
	 * Checks if this event should be released back into the pool.
	 *
	 * @return {boolean} True if this should not be released, false otherwise.
	 */
	isPersistent: functionThatReturnsFalse,

	/**
	 * `PooledClass` looks for `destructor` on each instance it releases.
	 */
	destructor: function () {
		var Interface = this.constructor.Interface;
		for (var propName in Interface) {
			{
				Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
			}
		}
		this.dispatchConfig = null;
		this._targetInst = null;
		this.nativeEvent = null;
		this.isDefaultPrevented = functionThatReturnsFalse;
		this.isPropagationStopped = functionThatReturnsFalse;
		this._dispatchListeners = null;
		this._dispatchInstances = null;
		{
			Object.defineProperty(this, 'nativeEvent', getPooledWarningPropertyDefinition('nativeEvent', null));
			Object.defineProperty(this, 'isDefaultPrevented', getPooledWarningPropertyDefinition('isDefaultPrevented', functionThatReturnsFalse));
			Object.defineProperty(this, 'isPropagationStopped', getPooledWarningPropertyDefinition('isPropagationStopped', functionThatReturnsFalse));
			Object.defineProperty(this, 'preventDefault', getPooledWarningPropertyDefinition('preventDefault', function () {}));
			Object.defineProperty(this, 'stopPropagation', getPooledWarningPropertyDefinition('stopPropagation', function () {}));
		}
	}
});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 */


function getEventKey(nativeEvent) {
	if (nativeEvent.key) {
		// Normalize inconsistent values reported by browsers due to
		// implementations of a working draft specification.

		// FireFox implements `key` but returns `MozPrintableKey` for all
		// printable characters (normalized to `Unidentified`), ignore it.
		var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
		if (key !== 'Unidentified') {
			return key;
		}
	}

	// Browser does not implement `key`, polyfill as much of it as we can.
	if (nativeEvent.type === 'keypress') {
		var charCode = getEventCharCode(nativeEvent);

		// The enter-key is technically both printable and non-printable and can
		// thus be captured by `keypress`, no other non-printable key should.
		return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
	}
	if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
		// While user keyboard layout determines the actual meaning of each
		// `keyCode` value, almost all function keys have a universal value.
		return translateToKey[nativeEvent.keyCode] || 'Unidentified';
	}
	return '';
}

addEventPoolingTo(SyntheticEvent);
var SyntheticUIEvent = SyntheticEvent.extend({
	view: null,
	detail: null
});
/**
   * @interface MouseEvent
   * @see http://www.w3.org/TR/DOM-Level-3-Events/
   */
  var SyntheticMouseEvent = SyntheticUIEvent.extend({
    screenX: null,
    screenY: null,
    clientX: null,
    clientY: null,
    pageX: null,
    pageY: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    getModifierState: getEventModifierState,
    button: null,
    buttons: null,
    relatedTarget: function (event) {
      return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
    },
    movementX: function (event) {
      if ('movementX' in event) {
        return event.movementX;
      }
  
      var screenX = previousScreenX;
      previousScreenX = event.screenX;
  
      if (!isMovementXSet) {
        isMovementXSet = true;
        return 0;
      }
  
      return event.type === 'mousemove' ? event.screenX - screenX : 0;
    },
    movementY: function (event) {
      if ('movementY' in event) {
        return event.movementY;
      }
  
      var screenY = previousScreenY;
      previousScreenY = event.screenY;
  
      if (!isMovementYSet) {
        isMovementYSet = true;
        return 0;
      }
  
      return event.type === 'mousemove' ? event.screenY - screenY : 0;
    }
  });
  
  /**
   * @interface PointerEvent
   * @see http://www.w3.org/TR/pointerevents/
   */
  var SyntheticPointerEvent = SyntheticMouseEvent.extend({
    pointerId: null,
    width: null,
    height: null,
    pressure: null,
    tangentialPressure: null,
    tiltX: null,
    tiltY: null,
    twist: null,
    pointerType: null,
    isPrimary: null
	});
	
	function getEventCharCode(nativeEvent) {
    var charCode = void 0;
    var keyCode = nativeEvent.keyCode;
  
    if ('charCode' in nativeEvent) {
      charCode = nativeEvent.charCode;
  
      // FF does not set `charCode` for the Enter-key, check against `keyCode`.
      if (charCode === 0 && keyCode === 13) {
        charCode = 13;
      }
    } else {
      // IE8 does not implement `charCode`, but `keyCode` has the correct value.
      charCode = keyCode;
    }
  
    // IE and Edge (on Windows) and Chrome / Safari (on Windows and Linux)
    // report Enter as charCode 10 when ctrl is pressed.
    if (charCode === 10) {
      charCode = 13;
    }
  
    // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
    // Must not discard the (non-)printable Enter-key.
    if (charCode >= 32 || charCode === 13) {
      return charCode;
    }
  
    return 0;
  }
  /**
   * @interface KeyboardEvent
   * @see http://www.w3.org/TR/DOM-Level-3-Events/
   */
  var SyntheticKeyboardEvent = SyntheticUIEvent.extend({
    key: getEventKey,
    location: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    repeat: null,
    locale: null,
    getModifierState: getEventModifierState,
    // Legacy Interface
    charCode: function (event) {
      // `charCode` is the result of a KeyPress event and represents the value of
      // the actual printable character.
  
      // KeyPress is deprecated, but its replacement is not yet final and not
      // implemented in any major browser. Only KeyPress has charCode.
      if (event.type === 'keypress') {
        return getEventCharCode(event);
      }
      return 0;
    },
    keyCode: function (event) {
      // `keyCode` is the result of a KeyDown/Up event and represents the value of
      // physical keyboard key.
  
      // The actual meaning of the value depends on the users' keyboard layout
      // which cannot be detected. Assuming that it is a US keyboard layout
      // provides a surprisingly accurate mapping for US and European users.
      // Due to this, it is left to the user to implement at this time.
      if (event.type === 'keydown' || event.type === 'keyup') {
        return event.keyCode;
      }
      return 0;
    },
    which: function (event) {
      // `which` is an alias for either `keyCode` or `charCode` depending on the
      // type of the event.
      if (event.type === 'keypress') {
        return getEventCharCode(event);
      }
      if (event.type === 'keydown' || event.type === 'keyup') {
        return event.keyCode;
      }
      return 0;
    }
	});
	
	  /**
   * @interface DragEvent
   * @see http://www.w3.org/TR/DOM-Level-3-Events/
   */
  var SyntheticDragEvent = SyntheticMouseEvent.extend({
    dataTransfer: null
	});
	
	 /**
   * @interface TouchEvent
   * @see http://www.w3.org/TR/touch-events/
   */
  var SyntheticTouchEvent = SyntheticUIEvent.extend({
    touches: null,
    targetTouches: null,
    changedTouches: null,
    altKey: null,
    metaKey: null,
    ctrlKey: null,
    shiftKey: null,
    getModifierState: getEventModifierState
  });
  
  /**
   * @interface Event
   * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
   */
  var SyntheticTransitionEvent = SyntheticEvent.extend({
    propertyName: null,
    elapsedTime: null,
    pseudoElement: null
  });
  
  /**
   * @interface WheelEvent
   * @see http://www.w3.org/TR/DOM-Level-3-Events/
   */
  var SyntheticWheelEvent = SyntheticMouseEvent.extend({
    deltaX: function (event) {
      return 'deltaX' in event ? event.deltaX : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
    },
    deltaY: function (event) {
      return 'deltaY' in event ? event.deltaY : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      'wheelDeltaY' in event ? -event.wheelDeltaY : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
      'wheelDelta' in event ? -event.wheelDelta : 0;
    },
  
    deltaZ: null,
  
    // Browsers without "deltaMode" is reporting in raw wheel delta where one
    // notch on the scroll is always +/- 120, roughly equivalent to pixels.
    // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
    // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
    deltaMode: null
	});

	var SyntheticClipboardEvent = SyntheticEvent.extend({
    clipboardData: function (event) {
      return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
    }
	});
	
	var SyntheticFocusEvent = SyntheticUIEvent.extend({
    relatedTarget: null
	});
	
	var SyntheticAnimationEvent = SyntheticEvent.extend({
    animationName: null,
    elapsedTime: null,
    pseudoElement: null
  });
	
	export {
		SyntheticEvent,
		SyntheticWheelEvent,
		SyntheticClipboardEvent,
		SyntheticMouseEvent,
		SyntheticPointerEvent,
		SyntheticFocusEvent,
		SyntheticKeyboardEvent,
		SyntheticDragEvent,
		SyntheticTouchEvent,
		SyntheticAnimationEvent,
		SyntheticTransitionEvent,
		SyntheticUIEvent,
		getEventCharCode
	}