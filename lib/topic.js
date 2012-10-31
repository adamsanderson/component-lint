
module.exports = Topic;

function Topic(name, cb){
  this.name     = name;
  this.messages = [];
  this.isDone   = false;
  
  this.cb = cb;
}

Topic.prototype.error = function(message){
  this.messages.push(["error", message]);
  this.done();
};

Topic.prototype.warn = function(message){
  this.messages.push(["warn", message]);
};

Topic.prototype.info = function(message){
  this.messages.push(["info", message]);
};

Topic.prototype.fatal = function(err){
  this.cb(err);
};

Topic.prototype.ok =
Topic.prototype.done = function(message){
  this.isDone = true;
  this.cb(null, this);
};