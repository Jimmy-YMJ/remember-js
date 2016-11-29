function MemoryStorage() {
  this.store = {};
}

MemoryStorage.prototype = {
  getItem: function(key){
    return this.store[key];
  },
  setItem: function(key, value){
    this.store[key] = value;
  }
};

module.exports = MemoryStorage;