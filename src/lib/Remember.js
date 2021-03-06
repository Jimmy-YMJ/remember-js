const Storage = require('./Storage');
const storageId = '#REMEMBER_JS_REMEMBER_QUEUE';

function Remember(options) {
  this.options = options || {};
  this.inSequence = options.inSequence || false;
  this.rememberQueue = new Storage(options.storageId || storageId, options.storage);
  this.onConsumingComplete = options.onConsumingComplete;
}

Remember.prototype = {
  registerAction: function (name, callback) {
    this.actions = this.actions || {};
    this.actions[name] = callback;
  },
  set: function (options) {
    Remember.call(this, Object.assign(this.options, options));
  },
  _remember: function (data) {
    this.rememberQueue.push(data);
  },
  _next: function () {
    this.rememberQueue.shift();
    if(typeof this.consumeCount === 'number'){
      this.consumeCount ++;
    }
    this._consumeInSequence();
  },
  do: function (name, a, b, c, d, e, f) {
    let args = argumentsToArray(arguments);
    if(this.inSequence){
      this._remember(args);
      this._consumeInSequence();
    }else {
      this._doAction.apply(this, args);
    }
  },
  _doAction: function (name, a, b, c, d, e, f) {
    let callback = this.actions[name],
      args = argumentsToArray(arguments);
    callback(this._remember.bind(this, args), a, b, c, d, e, f);
  },
  _doActionInSequence: function (name, a, b, c, d, e, f) {
    let callback = this.actions[name];
    callback(this._next.bind(this), a, b, c, d, e, f);
  },
  _consumeInSequence: function () {
    if(this.rememberQueue.getLength()){
      this._doActionInSequence.apply(this, this.rememberQueue.peek());
    }else if(typeof this.consumeCount === 'number'){
      if(this.consumeCount && typeof this.onConsumingComplete === 'function'){
        this.onConsumingComplete(this.consumeCount);
      }
      this.consumeCount = undefined;
    }
  },
  _consume: function () {
    let queueLength = this.rememberQueue.getLength(), i = 0;
    for(; i < queueLength; i ++){
      this._doAction.apply(this.rememberQueue.shift());
    }
  },
  consume: function () {
    if(this.inSequence){
      this.consumeCount = 0;
      this._consumeInSequence();
    }else {
      this._consume();
    }
  },
  clear: function () {
    this.rememberQueue.clear();
  }
};

module.exports = Remember;

function argumentsToArray(args) {
  let i = args.length, argsArr = [];
  while (i--) argsArr.unshift(args[i]);
  return argsArr;
}
