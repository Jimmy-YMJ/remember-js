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
  options = options || {};
  this.actions = {};
  this.inSequence = options.inSequence || false;
  this.rememberQueue = new Storage(options.storageId || storageId, options.storage);
  this.onConsumingComplete = options.onConsumingComplete;
}

Remember.prototype = {
  registerAction: function registerAction(name, callback) {
    this.actions[name] = callback;
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
    return JSON.parse(this.store.getItem(this.storeId)) || [];
  },
  _saveDataToStore: function _saveDataToStore(data) {
    this.store.setItem(this.storeId, JSON.stringify(data));
  }
};

module.exports = Storage;
},{"./MemoryStorage":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8uNi4wLjJAYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYnVpbGQvbW9kdWxlcy9pbmRleC5qcyIsImJ1aWxkL21vZHVsZXMvbGliL01lbW9yeVN0b3JhZ2UuanMiLCJidWlsZC9tb2R1bGVzL2xpYi9SZW1lbWJlci5qcyIsImJ1aWxkL21vZHVsZXMvbGliL1N0b3JhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL1JlbWVtYmVyJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIE1lbW9yeVN0b3JhZ2UoKSB7XG4gIHRoaXMuc3RvcmUgPSB7fTtcbn1cblxuTWVtb3J5U3RvcmFnZS5wcm90b3R5cGUgPSB7XG4gIGdldEl0ZW06IGZ1bmN0aW9uIGdldEl0ZW0oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmVba2V5XTtcbiAgfSxcbiAgc2V0SXRlbTogZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5U3RvcmFnZTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBTdG9yYWdlID0gcmVxdWlyZSgnLi9TdG9yYWdlJyk7XG52YXIgc3RvcmFnZUlkID0gJyNSRU1FTUJFUl9KU19SRU1FTUJFUl9RVUVVRSc7XG5cbmZ1bmN0aW9uIFJlbWVtYmVyKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMuYWN0aW9ucyA9IHt9O1xuICB0aGlzLmluU2VxdWVuY2UgPSBvcHRpb25zLmluU2VxdWVuY2UgfHwgZmFsc2U7XG4gIHRoaXMucmVtZW1iZXJRdWV1ZSA9IG5ldyBTdG9yYWdlKG9wdGlvbnMuc3RvcmFnZUlkIHx8IHN0b3JhZ2VJZCwgb3B0aW9ucy5zdG9yYWdlKTtcbiAgdGhpcy5vbkNvbnN1bWluZ0NvbXBsZXRlID0gb3B0aW9ucy5vbkNvbnN1bWluZ0NvbXBsZXRlO1xufVxuXG5SZW1lbWJlci5wcm90b3R5cGUgPSB7XG4gIHJlZ2lzdGVyQWN0aW9uOiBmdW5jdGlvbiByZWdpc3RlckFjdGlvbihuYW1lLCBjYWxsYmFjaykge1xuICAgIHRoaXMuYWN0aW9uc1tuYW1lXSA9IGNhbGxiYWNrO1xuICB9LFxuICBfcmVtZW1iZXI6IGZ1bmN0aW9uIF9yZW1lbWJlcihkYXRhKSB7XG4gICAgdGhpcy5yZW1lbWJlclF1ZXVlLnB1c2goZGF0YSk7XG4gIH0sXG4gIF9uZXh0OiBmdW5jdGlvbiBfbmV4dCgpIHtcbiAgICB0aGlzLnJlbWVtYmVyUXVldWUuc2hpZnQoKTtcbiAgICB0aGlzLmNvbnN1bWUoZmFsc2UpO1xuICB9LFxuICBkbzogZnVuY3Rpb24gX2RvKG5hbWUsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzKTtcbiAgICBpZiAodGhpcy5pblNlcXVlbmNlKSB7XG4gICAgICB0aGlzLl9yZW1lbWJlcihhcmdzKTtcbiAgICAgIHRoaXMuX2NvbnN1bWVJblNlcXVlbmNlKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kb0FjdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0sXG4gIF9kb0FjdGlvbjogZnVuY3Rpb24gX2RvQWN0aW9uKG5hbWUsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmFjdGlvbnNbbmFtZV0sXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cyk7XG4gICAgY2FsbGJhY2sodGhpcy5fcmVtZW1iZXIuYmluZCh0aGlzLCBhcmdzKSwgYSwgYiwgYywgZCwgZSwgZik7XG4gIH0sXG4gIF9kb0FjdGlvbkluU2VxdWVuY2U6IGZ1bmN0aW9uIF9kb0FjdGlvbkluU2VxdWVuY2UobmFtZSwgYSwgYiwgYywgZCwgZSwgZikge1xuICAgIHZhciBjYWxsYmFjayA9IHRoaXMuYWN0aW9uc1tuYW1lXTtcbiAgICBjYWxsYmFjayh0aGlzLl9uZXh0LmJpbmQodGhpcyksIGEsIGIsIGMsIGQsIGUsIGYpO1xuICB9LFxuICBfY29uc3VtZUluU2VxdWVuY2U6IGZ1bmN0aW9uIF9jb25zdW1lSW5TZXF1ZW5jZShpc0JlZ2lubmluZykge1xuICAgIGlmICh0aGlzLnJlbWVtYmVyUXVldWUuZ2V0TGVuZ3RoKCkpIHtcbiAgICAgIHRoaXMuX2RvQWN0aW9uSW5TZXF1ZW5jZS5hcHBseSh0aGlzLCB0aGlzLnJlbWVtYmVyUXVldWUucGVlaygpKTtcbiAgICB9IGVsc2UgaWYgKCFpc0JlZ2lubmluZyAmJiB0eXBlb2YgdGhpcy5vbkNvbnN1bWluZ0NvbXBsZXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uQ29uc3VtaW5nQ29tcGxldGUoKTtcbiAgICB9XG4gIH0sXG4gIF9jb25zdW1lOiBmdW5jdGlvbiBfY29uc3VtZSgpIHtcbiAgICB2YXIgcXVldWVMZW5ndGggPSB0aGlzLnJlbWVtYmVyUXVldWUuZ2V0TGVuZ3RoKCksXG4gICAgICAgIGkgPSAwO1xuICAgIGZvciAoOyBpIDwgcXVldWVMZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fZG9BY3Rpb24uYXBwbHkodGhpcy5yZW1lbWJlclF1ZXVlLnNoaWZ0KCkpO1xuICAgIH1cbiAgfSxcbiAgY29uc3VtZTogZnVuY3Rpb24gY29uc3VtZSgpIHtcbiAgICBpZiAodGhpcy5pblNlcXVlbmNlKSB7XG4gICAgICB0aGlzLl9jb25zdW1lSW5TZXF1ZW5jZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb25zdW1lKCk7XG4gICAgfVxuICB9LFxuICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdGhpcy5yZW1lbWJlclF1ZXVlLmNsZWFyKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVtZW1iZXI7XG5cbmZ1bmN0aW9uIGFyZ3VtZW50c1RvQXJyYXkoYXJncykge1xuICB2YXIgaSA9IGFyZ3MubGVuZ3RoLFxuICAgICAgYXJnc0FyciA9IFtdO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgYXJnc0Fyci51bnNoaWZ0KGFyZ3NbaV0pO1xuICB9cmV0dXJuIGFyZ3NBcnI7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTWVtb3J5U3RvcmFnZSA9IHJlcXVpcmUoJy4vTWVtb3J5U3RvcmFnZScpO1xuXG5mdW5jdGlvbiBTdG9yYWdlKHN0b3JlSWQsIHN0b3JhZ2UpIHtcbiAgdGhpcy5zdG9yZUlkID0gc3RvcmVJZDtcbiAgc3RvcmFnZSA9IHN0b3JhZ2UgfHwgbmV3IE1lbW9yeVN0b3JhZ2UoKTtcbiAgaWYgKCFzdG9yYWdlIHx8IHR5cGVvZiBzdG9yYWdlLmdldEl0ZW0gIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIHN0b3JhZ2Uuc2V0SXRlbSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHN0b3JhZ2UgbXVzdCBoYXZlIGJvdGggZ2V0SXRlbSBhbmQgc2V0SXRlbSBtZXRob2QuJyk7XG4gIH1cbiAgdGhpcy5zdG9yZSA9IHN0b3JhZ2U7XG59XG5cblN0b3JhZ2UucHJvdG90eXBlID0ge1xuICBwdXNoOiBmdW5jdGlvbiBwdXNoKHJlcXVlc3QpIHtcbiAgICB2YXIgc3RvcmVkID0gdGhpcy5fZ2V0U3RvcmVkRGF0YSgpO1xuICAgIHN0b3JlZC5wdXNoKHJlcXVlc3QpO1xuICAgIHRoaXMuX3NhdmVEYXRhVG9TdG9yZShzdG9yZWQpO1xuICAgIHJldHVybiBzdG9yZWQubGVuZ3RoO1xuICB9LFxuICBwZWVrOiBmdW5jdGlvbiBwZWVrKGluZGV4KSB7XG4gICAgaW5kZXggPSBpbmRleCB8fCAwO1xuICAgIHZhciBzdG9yZWQgPSB0aGlzLl9nZXRTdG9yZWREYXRhKCk7XG4gICAgcmV0dXJuIHN0b3JlZFtpbmRleF07XG4gIH0sXG4gIHNoaWZ0OiBmdW5jdGlvbiBzaGlmdCgpIHtcbiAgICB2YXIgc3RvcmVkID0gdGhpcy5fZ2V0U3RvcmVkRGF0YSgpLFxuICAgICAgICByZXF1ZXN0ID0gc3RvcmVkLnNoaWZ0KCk7XG4gICAgdGhpcy5fc2F2ZURhdGFUb1N0b3JlKHN0b3JlZCk7XG4gICAgcmV0dXJuIHJlcXVlc3Q7XG4gIH0sXG4gIGdldExlbmd0aDogZnVuY3Rpb24gZ2V0TGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRTdG9yZWREYXRhKCkubGVuZ3RoO1xuICB9LFxuICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdGhpcy5fc2F2ZURhdGFUb1N0b3JlKFtdKTtcbiAgfSxcbiAgX2dldFN0b3JlZERhdGE6IGZ1bmN0aW9uIF9nZXRTdG9yZWREYXRhKCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuc3RvcmUuZ2V0SXRlbSh0aGlzLnN0b3JlSWQpKSB8fCBbXTtcbiAgfSxcbiAgX3NhdmVEYXRhVG9TdG9yZTogZnVuY3Rpb24gX3NhdmVEYXRhVG9TdG9yZShkYXRhKSB7XG4gICAgdGhpcy5zdG9yZS5zZXRJdGVtKHRoaXMuc3RvcmVJZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JhZ2U7Il19
