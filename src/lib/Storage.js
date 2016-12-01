const MemoryStorage = require('./MemoryStorage');

function Storage(storeId, storage) {
  this.storeId = storeId;
  storage = storage || new MemoryStorage();
  if(!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function'){
    throw new Error('The storage must have both getItem and setItem method.');
  }
  this.store = storage;
}

Storage.prototype = {
  push: function (request) {
    let stored = this._getStoredData();
    stored.push(request);
    this._saveDataToStore(stored);
    return stored.length;
  },
  peek: function (index) {
    index = index || 0;
    let stored = this._getStoredData();
    return stored[index];
  },
  shift: function () {
    let stored = this._getStoredData(),
      request = stored.shift();
    this._saveDataToStore(stored);
    return request;
  },
  getLength: function () {
    return this._getStoredData().length;
  },
  clear: function () {
    this._saveDataToStore([]);
  },
  _getStoredData: function () {
    return JSON.parse(this.store.getItem(this.storeId) || JSON.stringify('')) || [];
  },
  _saveDataToStore: function (data) {
    this.store.setItem(this.storeId, JSON.stringify(data));
  }
};

module.exports = Storage;
