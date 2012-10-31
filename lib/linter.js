
/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;

/**
 * Expose Linter
 */
module.exports = Linter;


function Linter(){
  this.pending = [];
  this.results = [];
  this.running = false;
  this.topicName = "";
}

/**
 * Inherits from `Emitter.prototype`.
 */
Linter.prototype.__proto__ = Emitter.prototype;

Linter.prototype.check = function(name, fn){
  if (this.topicName.length){
    name = "  " + this.topicName.match(/^\s*/)[0] + name;
  }
  this.pending.push({name: name, fn: fn});
}

Linter.prototype.error = function(message){
  this.emit("error", this.topicName, message);
}

Linter.prototype.warn = function(message){
  this.emit("warn", this.topicName, message);
}

Linter.prototype.done = function(){
  this.emit("done", this.topicName);
}

Linter.prototype.run = function(cb){
  if (this.pending.length === 0) return cb(null, this.results);
  
  if (!this.running){
    this.running = true;
    this.pending = this.pending.reverse();
  }
  
  var check = this.pending.pop();
  var name  = check.name;
  var fn    = check.fn;
  var self  = this;
  
  this.topicName = name;
  
  try {
    if (fn.length === 0){
      this.runSync(fn, cb);
    } else {
      this.runAsync(fn, cb);
    }
  } catch (error) {
    cb(error);
  }
}

Linter.prototype.runSync = function(fn, cb){
  fn.call(this);
  this.done();
  
  this.run(cb);
};

Linter.prototype.runAsync = function(fn, cb){
  var self = this;
  
  fn.call(this, function(err){
    if (err) return cb(err);  
    self.done();
    
    self.run(cb);
  });
};