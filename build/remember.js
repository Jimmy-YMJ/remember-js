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
  this.inSequence = options.inSequence || false;
  this.rememberQueue = new Storage(options.storageId || storageId, options.storage);
  this.onConsumingComplete = options.onConsumingComplete;
}

Remember.prototype = {
  registerAction: function registerAction(name, callback) {
    this.actions = this.actions || {};
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
    if (typeof this.consumeCount === 'number') {
      this.consumeCount++;
    }
    this._consumeInSequence();
  },
  do: function _do(name, a, b, c, d, e, f) {
    var args = argumentsToArray(arguments);
    if (this.inSequence) {
      this._remember(args);
      this._consumeInSequence();
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
  _consumeInSequence: function _consumeInSequence() {
    if (this.rememberQueue.getLength()) {
      this._doActionInSequence.apply(this, this.rememberQueue.peek());
    } else if (typeof this.consumeCount === 'number') {
      if (this.consumeCount && typeof this.onConsumingComplete === 'function') {
        this.onConsumingComplete(this.consumeCount);
      }
      this.consumeCount = undefined;
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
      this.consumeCount = 0;
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
    return JSON.parse(this.store.getItem(this.storeId) || JSON.stringify('')) || [];
  },
  _saveDataToStore: function _saveDataToStore(data) {
    this.store.setItem(this.storeId, JSON.stringify(data));
  }
};

module.exports = Storage;
},{"./MemoryStorage":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8uNi4wLjJAYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvbW9kdWxlcy9pbmRleC5qcyIsImJ1aWxkL21vZHVsZXMvbGliL01lbW9yeVN0b3JhZ2UuanMiLCJidWlsZC9tb2R1bGVzL2xpYi9SZW1lbWJlci5qcyIsImJ1aWxkL21vZHVsZXMvbGliL1N0b3JhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvUmVtZW1iZXInKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gTWVtb3J5U3RvcmFnZSgpIHtcbiAgdGhpcy5zdG9yZSA9IHt9O1xufVxuXG5NZW1vcnlTdG9yYWdlLnByb3RvdHlwZSA9IHtcbiAgZ2V0SXRlbTogZnVuY3Rpb24gZ2V0SXRlbShrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yZVtrZXldO1xuICB9LFxuICBzZXRJdGVtOiBmdW5jdGlvbiBzZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgICB0aGlzLnN0b3JlW2tleV0gPSB2YWx1ZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlTdG9yYWdlOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFN0b3JhZ2UgPSByZXF1aXJlKCcuL1N0b3JhZ2UnKTtcbnZhciBzdG9yYWdlSWQgPSAnI1JFTUVNQkVSX0pTX1JFTUVNQkVSX1FVRVVFJztcblxuZnVuY3Rpb24gUmVtZW1iZXIob3B0aW9ucykge1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB0aGlzLmluU2VxdWVuY2UgPSBvcHRpb25zLmluU2VxdWVuY2UgfHwgZmFsc2U7XG4gIHRoaXMucmVtZW1iZXJRdWV1ZSA9IG5ldyBTdG9yYWdlKG9wdGlvbnMuc3RvcmFnZUlkIHx8IHN0b3JhZ2VJZCwgb3B0aW9ucy5zdG9yYWdlKTtcbiAgdGhpcy5vbkNvbnN1bWluZ0NvbXBsZXRlID0gb3B0aW9ucy5vbkNvbnN1bWluZ0NvbXBsZXRlO1xufVxuXG5SZW1lbWJlci5wcm90b3R5cGUgPSB7XG4gIHJlZ2lzdGVyQWN0aW9uOiBmdW5jdGlvbiByZWdpc3RlckFjdGlvbihuYW1lLCBjYWxsYmFjaykge1xuICAgIHRoaXMuYWN0aW9ucyA9IHRoaXMuYWN0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmFjdGlvbnNbbmFtZV0gPSBjYWxsYmFjaztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiBzZXQob3B0aW9ucykge1xuICAgIFJlbWVtYmVyLmNhbGwodGhpcywgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpKTtcbiAgfSxcbiAgX3JlbWVtYmVyOiBmdW5jdGlvbiBfcmVtZW1iZXIoZGF0YSkge1xuICAgIHRoaXMucmVtZW1iZXJRdWV1ZS5wdXNoKGRhdGEpO1xuICB9LFxuICBfbmV4dDogZnVuY3Rpb24gX25leHQoKSB7XG4gICAgdGhpcy5yZW1lbWJlclF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNvbnN1bWVDb3VudCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMuY29uc3VtZUNvdW50Kys7XG4gICAgfVxuICAgIHRoaXMuX2NvbnN1bWVJblNlcXVlbmNlKCk7XG4gIH0sXG4gIGRvOiBmdW5jdGlvbiBfZG8obmFtZSwgYSwgYiwgYywgZCwgZSwgZikge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMpO1xuICAgIGlmICh0aGlzLmluU2VxdWVuY2UpIHtcbiAgICAgIHRoaXMuX3JlbWVtYmVyKGFyZ3MpO1xuICAgICAgdGhpcy5fY29uc3VtZUluU2VxdWVuY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZG9BY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9LFxuICBfZG9BY3Rpb246IGZ1bmN0aW9uIF9kb0FjdGlvbihuYW1lLCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy5hY3Rpb25zW25hbWVdLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMpO1xuICAgIGNhbGxiYWNrKHRoaXMuX3JlbWVtYmVyLmJpbmQodGhpcywgYXJncyksIGEsIGIsIGMsIGQsIGUsIGYpO1xuICB9LFxuICBfZG9BY3Rpb25JblNlcXVlbmNlOiBmdW5jdGlvbiBfZG9BY3Rpb25JblNlcXVlbmNlKG5hbWUsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmFjdGlvbnNbbmFtZV07XG4gICAgY2FsbGJhY2sodGhpcy5fbmV4dC5iaW5kKHRoaXMpLCBhLCBiLCBjLCBkLCBlLCBmKTtcbiAgfSxcbiAgX2NvbnN1bWVJblNlcXVlbmNlOiBmdW5jdGlvbiBfY29uc3VtZUluU2VxdWVuY2UoKSB7XG4gICAgaWYgKHRoaXMucmVtZW1iZXJRdWV1ZS5nZXRMZW5ndGgoKSkge1xuICAgICAgdGhpcy5fZG9BY3Rpb25JblNlcXVlbmNlLmFwcGx5KHRoaXMsIHRoaXMucmVtZW1iZXJRdWV1ZS5wZWVrKCkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY29uc3VtZUNvdW50ID09PSAnbnVtYmVyJykge1xuICAgICAgaWYgKHRoaXMuY29uc3VtZUNvdW50ICYmIHR5cGVvZiB0aGlzLm9uQ29uc3VtaW5nQ29tcGxldGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5vbkNvbnN1bWluZ0NvbXBsZXRlKHRoaXMuY29uc3VtZUNvdW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29uc3VtZUNvdW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcbiAgX2NvbnN1bWU6IGZ1bmN0aW9uIF9jb25zdW1lKCkge1xuICAgIHZhciBxdWV1ZUxlbmd0aCA9IHRoaXMucmVtZW1iZXJRdWV1ZS5nZXRMZW5ndGgoKSxcbiAgICAgICAgaSA9IDA7XG4gICAgZm9yICg7IGkgPCBxdWV1ZUxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9kb0FjdGlvbi5hcHBseSh0aGlzLnJlbWVtYmVyUXVldWUuc2hpZnQoKSk7XG4gICAgfVxuICB9LFxuICBjb25zdW1lOiBmdW5jdGlvbiBjb25zdW1lKCkge1xuICAgIGlmICh0aGlzLmluU2VxdWVuY2UpIHtcbiAgICAgIHRoaXMuY29uc3VtZUNvdW50ID0gMDtcbiAgICAgIHRoaXMuX2NvbnN1bWVJblNlcXVlbmNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbnN1bWUoKTtcbiAgICB9XG4gIH0sXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLnJlbWVtYmVyUXVldWUuY2xlYXIoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZW1lbWJlcjtcblxuZnVuY3Rpb24gYXJndW1lbnRzVG9BcnJheShhcmdzKSB7XG4gIHZhciBpID0gYXJncy5sZW5ndGgsXG4gICAgICBhcmdzQXJyID0gW107XG4gIHdoaWxlIChpLS0pIHtcbiAgICBhcmdzQXJyLnVuc2hpZnQoYXJnc1tpXSk7XG4gIH1yZXR1cm4gYXJnc0Fycjtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNZW1vcnlTdG9yYWdlID0gcmVxdWlyZSgnLi9NZW1vcnlTdG9yYWdlJyk7XG5cbmZ1bmN0aW9uIFN0b3JhZ2Uoc3RvcmVJZCwgc3RvcmFnZSkge1xuICB0aGlzLnN0b3JlSWQgPSBzdG9yZUlkO1xuICBzdG9yYWdlID0gc3RvcmFnZSB8fCBuZXcgTWVtb3J5U3RvcmFnZSgpO1xuICBpZiAoIXN0b3JhZ2UgfHwgdHlwZW9mIHN0b3JhZ2UuZ2V0SXRlbSAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygc3RvcmFnZS5zZXRJdGVtICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3RvcmFnZSBtdXN0IGhhdmUgYm90aCBnZXRJdGVtIGFuZCBzZXRJdGVtIG1ldGhvZC4nKTtcbiAgfVxuICB0aGlzLnN0b3JlID0gc3RvcmFnZTtcbn1cblxuU3RvcmFnZS5wcm90b3R5cGUgPSB7XG4gIHB1c2g6IGZ1bmN0aW9uIHB1c2gocmVxdWVzdCkge1xuICAgIHZhciBzdG9yZWQgPSB0aGlzLl9nZXRTdG9yZWREYXRhKCk7XG4gICAgc3RvcmVkLnB1c2gocmVxdWVzdCk7XG4gICAgdGhpcy5fc2F2ZURhdGFUb1N0b3JlKHN0b3JlZCk7XG4gICAgcmV0dXJuIHN0b3JlZC5sZW5ndGg7XG4gIH0sXG4gIHBlZWs6IGZ1bmN0aW9uIHBlZWsoaW5kZXgpIHtcbiAgICBpbmRleCA9IGluZGV4IHx8IDA7XG4gICAgdmFyIHN0b3JlZCA9IHRoaXMuX2dldFN0b3JlZERhdGEoKTtcbiAgICByZXR1cm4gc3RvcmVkW2luZGV4XTtcbiAgfSxcbiAgc2hpZnQ6IGZ1bmN0aW9uIHNoaWZ0KCkge1xuICAgIHZhciBzdG9yZWQgPSB0aGlzLl9nZXRTdG9yZWREYXRhKCksXG4gICAgICAgIHJlcXVlc3QgPSBzdG9yZWQuc2hpZnQoKTtcbiAgICB0aGlzLl9zYXZlRGF0YVRvU3RvcmUoc3RvcmVkKTtcbiAgICByZXR1cm4gcmVxdWVzdDtcbiAgfSxcbiAgZ2V0TGVuZ3RoOiBmdW5jdGlvbiBnZXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFN0b3JlZERhdGEoKS5sZW5ndGg7XG4gIH0sXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLl9zYXZlRGF0YVRvU3RvcmUoW10pO1xuICB9LFxuICBfZ2V0U3RvcmVkRGF0YTogZnVuY3Rpb24gX2dldFN0b3JlZERhdGEoKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yZS5nZXRJdGVtKHRoaXMuc3RvcmVJZCkgfHwgSlNPTi5zdHJpbmdpZnkoJycpKSB8fCBbXTtcbiAgfSxcbiAgX3NhdmVEYXRhVG9TdG9yZTogZnVuY3Rpb24gX3NhdmVEYXRhVG9TdG9yZShkYXRhKSB7XG4gICAgdGhpcy5zdG9yZS5zZXRJdGVtKHRoaXMuc3RvcmVJZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JhZ2U7Il19
