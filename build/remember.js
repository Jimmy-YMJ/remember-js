(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Remember = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./lib/Remember');
},{"./lib/Remember":3}],2:[function(_dereq_,module,exports){
"use strict";

function MemoryStorage() {
  this.store = {};
}

MemoryStorage.prototype = {
  getItem: function getItem(key) {
    return this.store[key];
  },
  setItem: function setItem(key, value) {
    this.store[key] = value;
  }
};

module.exports = MemoryStorage;
},{}],3:[function(_dereq_,module,exports){
'use strict';

var Storage = _dereq_('./Storage');
var storageId = '#REMEMBER_JS_REMEMBER_QUEUE';

function Remember(options) {
  this.options = options || {};
  this.actions = {};
  this.inSequence = options.inSequence || false;
  this.rememberQueue = new Storage(options.storageId || storageId, options.storage);
  this.onConsumingComplete = options.onConsumingComplete;
}

Remember.prototype = {
  registerAction: function registerAction(name, callback) {
    this.actions[name] = callback;
  },
  set: function set(options) {
    Remember.call(this, Object.assign(this.options, options));
  },
  _remember: function _remember(data) {
    this.rememberQueue.push(data);
  },
  _next: function _next() {
    this.rememberQueue.shift();
    this.consume(false);
  },
  do: function _do(name, a, b, c, d, e, f) {
    var args = argumentsToArray(arguments);
    if (this.inSequence) {
      this._remember(args);
      this._consumeInSequence(true);
    } else {
      this._doAction.apply(this, args);
    }
  },
  _doAction: function _doAction(name, a, b, c, d, e, f) {
    var callback = this.actions[name],
        args = argumentsToArray(arguments);
    callback(this._remember.bind(this, args), a, b, c, d, e, f);
  },
  _doActionInSequence: function _doActionInSequence(name, a, b, c, d, e, f) {
    var callback = this.actions[name];
    callback(this._next.bind(this), a, b, c, d, e, f);
  },
  _consumeInSequence: function _consumeInSequence(isBeginning) {
    if (this.rememberQueue.getLength()) {
      this._doActionInSequence.apply(this, this.rememberQueue.peek());
    } else if (!isBeginning && typeof this.onConsumingComplete === 'function') {
      this.onConsumingComplete();
    }
  },
  _consume: function _consume() {
    var queueLength = this.rememberQueue.getLength(),
        i = 0;
    for (; i < queueLength; i++) {
      this._doAction.apply(this.rememberQueue.shift());
    }
  },
  consume: function consume() {
    if (this.inSequence) {
      this._consumeInSequence();
    } else {
      this._consume();
    }
  },
  clear: function clear() {
    this.rememberQueue.clear();
  }
};

module.exports = Remember;

function argumentsToArray(args) {
  var i = args.length,
      argsArr = [];
  while (i--) {
    argsArr.unshift(args[i]);
  }return argsArr;
}
},{"./Storage":4}],4:[function(_dereq_,module,exports){
'use strict';

var MemoryStorage = _dereq_('./MemoryStorage');

function Storage(storeId, storage) {
  this.storeId = storeId;
  storage = storage || new MemoryStorage();
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    throw new Error('The storage must have both getItem and setItem method.');
  }
  this.store = storage;
}

Storage.prototype = {
  push: function push(request) {
    var stored = this._getStoredData();
    stored.push(request);
    this._saveDataToStore(stored);
    return stored.length;
  },
  peek: function peek(index) {
    index = index || 0;
    var stored = this._getStoredData();
    return stored[index];
  },
  shift: function shift() {
    var stored = this._getStoredData(),
        request = stored.shift();
    this._saveDataToStore(stored);
    return request;
  },
  getLength: function getLength() {
    return this._getStoredData().length;
  },
  clear: function clear() {
    this._saveDataToStore([]);
  },
  _getStoredData: function _getStoredData() {
    return JSON.parse(this.store.getItem(this.storeId) || '') || [];
  },
  _saveDataToStore: function _saveDataToStore(data) {
    this.store.setItem(this.storeId, JSON.stringify(data));
  }
};

module.exports = Storage;
},{"./MemoryStorage":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8uNi4wLjJAYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvbW9kdWxlcy9pbmRleC5qcyIsImJ1aWxkL21vZHVsZXMvbGliL01lbW9yeVN0b3JhZ2UuanMiLCJidWlsZC9tb2R1bGVzL2xpYi9SZW1lbWJlci5qcyIsImJ1aWxkL21vZHVsZXMvbGliL1N0b3JhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL1JlbWVtYmVyJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIE1lbW9yeVN0b3JhZ2UoKSB7XG4gIHRoaXMuc3RvcmUgPSB7fTtcbn1cblxuTWVtb3J5U3RvcmFnZS5wcm90b3R5cGUgPSB7XG4gIGdldEl0ZW06IGZ1bmN0aW9uIGdldEl0ZW0oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmVba2V5XTtcbiAgfSxcbiAgc2V0SXRlbTogZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5U3RvcmFnZTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBTdG9yYWdlID0gcmVxdWlyZSgnLi9TdG9yYWdlJyk7XG52YXIgc3RvcmFnZUlkID0gJyNSRU1FTUJFUl9KU19SRU1FTUJFUl9RVUVVRSc7XG5cbmZ1bmN0aW9uIFJlbWVtYmVyKG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5hY3Rpb25zID0ge307XG4gIHRoaXMuaW5TZXF1ZW5jZSA9IG9wdGlvbnMuaW5TZXF1ZW5jZSB8fCBmYWxzZTtcbiAgdGhpcy5yZW1lbWJlclF1ZXVlID0gbmV3IFN0b3JhZ2Uob3B0aW9ucy5zdG9yYWdlSWQgfHwgc3RvcmFnZUlkLCBvcHRpb25zLnN0b3JhZ2UpO1xuICB0aGlzLm9uQ29uc3VtaW5nQ29tcGxldGUgPSBvcHRpb25zLm9uQ29uc3VtaW5nQ29tcGxldGU7XG59XG5cblJlbWVtYmVyLnByb3RvdHlwZSA9IHtcbiAgcmVnaXN0ZXJBY3Rpb246IGZ1bmN0aW9uIHJlZ2lzdGVyQWN0aW9uKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5hY3Rpb25zW25hbWVdID0gY2FsbGJhY2s7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gc2V0KG9wdGlvbnMpIHtcbiAgICBSZW1lbWJlci5jYWxsKHRoaXMsIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKSk7XG4gIH0sXG4gIF9yZW1lbWJlcjogZnVuY3Rpb24gX3JlbWVtYmVyKGRhdGEpIHtcbiAgICB0aGlzLnJlbWVtYmVyUXVldWUucHVzaChkYXRhKTtcbiAgfSxcbiAgX25leHQ6IGZ1bmN0aW9uIF9uZXh0KCkge1xuICAgIHRoaXMucmVtZW1iZXJRdWV1ZS5zaGlmdCgpO1xuICAgIHRoaXMuY29uc3VtZShmYWxzZSk7XG4gIH0sXG4gIGRvOiBmdW5jdGlvbiBfZG8obmFtZSwgYSwgYiwgYywgZCwgZSwgZikge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMpO1xuICAgIGlmICh0aGlzLmluU2VxdWVuY2UpIHtcbiAgICAgIHRoaXMuX3JlbWVtYmVyKGFyZ3MpO1xuICAgICAgdGhpcy5fY29uc3VtZUluU2VxdWVuY2UodHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RvQWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSxcbiAgX2RvQWN0aW9uOiBmdW5jdGlvbiBfZG9BY3Rpb24obmFtZSwgYSwgYiwgYywgZCwgZSwgZikge1xuICAgIHZhciBjYWxsYmFjayA9IHRoaXMuYWN0aW9uc1tuYW1lXSxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzKTtcbiAgICBjYWxsYmFjayh0aGlzLl9yZW1lbWJlci5iaW5kKHRoaXMsIGFyZ3MpLCBhLCBiLCBjLCBkLCBlLCBmKTtcbiAgfSxcbiAgX2RvQWN0aW9uSW5TZXF1ZW5jZTogZnVuY3Rpb24gX2RvQWN0aW9uSW5TZXF1ZW5jZShuYW1lLCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy5hY3Rpb25zW25hbWVdO1xuICAgIGNhbGxiYWNrKHRoaXMuX25leHQuYmluZCh0aGlzKSwgYSwgYiwgYywgZCwgZSwgZik7XG4gIH0sXG4gIF9jb25zdW1lSW5TZXF1ZW5jZTogZnVuY3Rpb24gX2NvbnN1bWVJblNlcXVlbmNlKGlzQmVnaW5uaW5nKSB7XG4gICAgaWYgKHRoaXMucmVtZW1iZXJRdWV1ZS5nZXRMZW5ndGgoKSkge1xuICAgICAgdGhpcy5fZG9BY3Rpb25JblNlcXVlbmNlLmFwcGx5KHRoaXMsIHRoaXMucmVtZW1iZXJRdWV1ZS5wZWVrKCkpO1xuICAgIH0gZWxzZSBpZiAoIWlzQmVnaW5uaW5nICYmIHR5cGVvZiB0aGlzLm9uQ29uc3VtaW5nQ29tcGxldGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25Db25zdW1pbmdDb21wbGV0ZSgpO1xuICAgIH1cbiAgfSxcbiAgX2NvbnN1bWU6IGZ1bmN0aW9uIF9jb25zdW1lKCkge1xuICAgIHZhciBxdWV1ZUxlbmd0aCA9IHRoaXMucmVtZW1iZXJRdWV1ZS5nZXRMZW5ndGgoKSxcbiAgICAgICAgaSA9IDA7XG4gICAgZm9yICg7IGkgPCBxdWV1ZUxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9kb0FjdGlvbi5hcHBseSh0aGlzLnJlbWVtYmVyUXVldWUuc2hpZnQoKSk7XG4gICAgfVxuICB9LFxuICBjb25zdW1lOiBmdW5jdGlvbiBjb25zdW1lKCkge1xuICAgIGlmICh0aGlzLmluU2VxdWVuY2UpIHtcbiAgICAgIHRoaXMuX2NvbnN1bWVJblNlcXVlbmNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbnN1bWUoKTtcbiAgICB9XG4gIH0sXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLnJlbWVtYmVyUXVldWUuY2xlYXIoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZW1lbWJlcjtcblxuZnVuY3Rpb24gYXJndW1lbnRzVG9BcnJheShhcmdzKSB7XG4gIHZhciBpID0gYXJncy5sZW5ndGgsXG4gICAgICBhcmdzQXJyID0gW107XG4gIHdoaWxlIChpLS0pIHtcbiAgICBhcmdzQXJyLnVuc2hpZnQoYXJnc1tpXSk7XG4gIH1yZXR1cm4gYXJnc0Fycjtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNZW1vcnlTdG9yYWdlID0gcmVxdWlyZSgnLi9NZW1vcnlTdG9yYWdlJyk7XG5cbmZ1bmN0aW9uIFN0b3JhZ2Uoc3RvcmVJZCwgc3RvcmFnZSkge1xuICB0aGlzLnN0b3JlSWQgPSBzdG9yZUlkO1xuICBzdG9yYWdlID0gc3RvcmFnZSB8fCBuZXcgTWVtb3J5U3RvcmFnZSgpO1xuICBpZiAoIXN0b3JhZ2UgfHwgdHlwZW9mIHN0b3JhZ2UuZ2V0SXRlbSAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygc3RvcmFnZS5zZXRJdGVtICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3RvcmFnZSBtdXN0IGhhdmUgYm90aCBnZXRJdGVtIGFuZCBzZXRJdGVtIG1ldGhvZC4nKTtcbiAgfVxuICB0aGlzLnN0b3JlID0gc3RvcmFnZTtcbn1cblxuU3RvcmFnZS5wcm90b3R5cGUgPSB7XG4gIHB1c2g6IGZ1bmN0aW9uIHB1c2gocmVxdWVzdCkge1xuICAgIHZhciBzdG9yZWQgPSB0aGlzLl9nZXRTdG9yZWREYXRhKCk7XG4gICAgc3RvcmVkLnB1c2gocmVxdWVzdCk7XG4gICAgdGhpcy5fc2F2ZURhdGFUb1N0b3JlKHN0b3JlZCk7XG4gICAgcmV0dXJuIHN0b3JlZC5sZW5ndGg7XG4gIH0sXG4gIHBlZWs6IGZ1bmN0aW9uIHBlZWsoaW5kZXgpIHtcbiAgICBpbmRleCA9IGluZGV4IHx8IDA7XG4gICAgdmFyIHN0b3JlZCA9IHRoaXMuX2dldFN0b3JlZERhdGEoKTtcbiAgICByZXR1cm4gc3RvcmVkW2luZGV4XTtcbiAgfSxcbiAgc2hpZnQ6IGZ1bmN0aW9uIHNoaWZ0KCkge1xuICAgIHZhciBzdG9yZWQgPSB0aGlzLl9nZXRTdG9yZWREYXRhKCksXG4gICAgICAgIHJlcXVlc3QgPSBzdG9yZWQuc2hpZnQoKTtcbiAgICB0aGlzLl9zYXZlRGF0YVRvU3RvcmUoc3RvcmVkKTtcbiAgICByZXR1cm4gcmVxdWVzdDtcbiAgfSxcbiAgZ2V0TGVuZ3RoOiBmdW5jdGlvbiBnZXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFN0b3JlZERhdGEoKS5sZW5ndGg7XG4gIH0sXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLl9zYXZlRGF0YVRvU3RvcmUoW10pO1xuICB9LFxuICBfZ2V0U3RvcmVkRGF0YTogZnVuY3Rpb24gX2dldFN0b3JlZERhdGEoKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yZS5nZXRJdGVtKHRoaXMuc3RvcmVJZCkgfHwgJycpIHx8IFtdO1xuICB9LFxuICBfc2F2ZURhdGFUb1N0b3JlOiBmdW5jdGlvbiBfc2F2ZURhdGFUb1N0b3JlKGRhdGEpIHtcbiAgICB0aGlzLnN0b3JlLnNldEl0ZW0odGhpcy5zdG9yZUlkLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmFnZTsiXX0=
