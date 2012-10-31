
/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;

/**
 * Expose Linter
 */
module.exports = Linter;

/**
 * Create a new Linter.
 */
function Linter(){
  this.pending = [];
  this.running = false;
  this.topicName = "";
}

/**
 * Inherits from `Emitter.prototype`.
 */
Linter.prototype.__proto__ = Emitter.prototype;

/**
 * Add a check to be run.  If the linter is already running,
 * the check will be scheduled to run as soon as this one
 * completes.
 *
 * Example:
 * 
 *   // Add a synchronous check:
 *   linter.check("math", function(){
 *     if (1+2 != 3) this.error("doesn't look good");
 *   });
 *
 *   // Add an asynchronous check:
 *   linter.check("file", function(done){
 *     fs.exists(path, function(exist){
 *       if (!exist) this.error("must exist");
 *       done();
 *     }
 *   });
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */
Linter.prototype.check = function(name, fn){
  if (this.topicName.length){
    name = "  " + this.topicName.match(/^\s*/)[0] + name;
  }
  this.pending.push({name: name, fn: fn});
};

/**
  * Trigger an error event for the currently executing `check`.
  *
  * @param {String} message
  * @api public
  */
Linter.prototype.error = function(message){
  this.emit("error", this.topicName, message);
};

/**
  * Trigger a warning event for the currently executing `check`.
  *
  * @param {String} message
  * @api public
  */
Linter.prototype.warn = function(message){
  this.emit("warn", this.topicName, message);
};

/**
  * Signals that the current `check` has completed.
  *
  * @param {String} message
  * @api private
  */
Linter.prototype.done = function(){
  this.emit("done", this.topicName);
};

/**
  * Runs each check queued up for the linter.
  *
  * @param {Function(err, result)} cb
  * @api public
  */
Linter.prototype.run = function(cb){
  if (this.pending.length === 0) return cb(null, this);
  
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
};

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