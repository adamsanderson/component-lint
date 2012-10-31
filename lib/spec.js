var Linter = require('./linter')
  , path = require('path')
  , fs = require('fs');

/**
  * Configures a Linter to check the Component Spec.
  *
  * @param {String} componentRoot the path the component
  * @param {Object} component
  * @api public
  */
module.exports = function spec(componentRoot, component){
  var linter = new Linter();
  
  linter.check(".name", function(){
    var name = component.name;
    
    if (isBlank(name)) return this.error("cannot be blank");
  });
  
  linter.check(".version", function(){
    var version = component.version;
    
    if (isBlank(version)) return this.error("cannot be blank");
  });
  
  linter.check(".description", function(){
    var description = component.description;
    
    if (!description){
      this.error("is required");
    } else if (isBlank(description)){
      this.warn("should not be blank");
    }
  });
  
  linter.check(".keywords", function(){
    var keywords = component.keywords;
    
    if (!keywords) {
      this.error("are required");
    } else if (keywords.length === 0) {
      this.warn("should not be blank");
    }
  });
  
  linter.check(".repo", function(){
    var repo = component.repo;
    
    if (!isRepoFormat(repo)) this.error("must be '<username>/<project>' format");
  });
  
  linter.check(".main", function(done){
    var mainPath = path.resolve(componentRoot, component.main || "index.js");
    
    fs.exists(mainPath, function(exist){
      if (!exist) this.error(mainPath+" must exist");
      
      done();
    });
  });
  
  linter.check(".scripts", function(){
    var paths = component.scripts;
    if (!paths) return;
    
    paths.forEach(function(path){
      this.check(path, function(){
        if (!hasExtension(path, '.js')){
          this.error("should be plain JavaScript");
        }
      });
    }, this);
  });
  
  linter.check(".styles", function(){
    var paths = component.styles;
    if (!paths) return;
    
    paths.forEach(function(path){
      this.check(path, function(){
        if (!hasExtension(path, '.css')){
          this.error("should be plain CSS");
        }
      });
    }, this);
  });
  
  linter.check(".dependencies", function(){
    var deps = component.dependencies;
    if (!deps) return this.error("are required");
    
    Object.keys(deps).forEach(function(key){
      this.check(key, function(){
        if (!isRepoFormat(key)) this.error("must be '<username>/<project>' format");
        if (isBlank(deps[key])) this.error("must specify a version"); 
      });
      
    },this);
    
  });
  
  linter.check(".development", function(){
    var deps = component.development;
    if (!deps) return this.error("are required");
    
    Object.keys(deps).forEach(function(key){
      this.check(key, function(){
        if (!isRepoFormat(key)) this.error("must be '<username>/<project>' format");
        if (isBlank(deps[key])) this.error("must specify a version"); 
      });
      
    },this);    
    
  });
  
  linter.check(".remotes", function(){
    var urls = component.remotes;
    
    if (!urls || urls.length === 0) return;
    
    urls.forEach(function(u){
      this.check(u, function(){
        var parsedUrl = url.parse(url);
      
        if (!parsedUrl.protocol) this.error("should have a protocol (http://)");
        if (!parsedUrl.host)     this.error("should have a host (example.com)");
      });
    }, this);
  });
  
  linter.check(".license", function(){
    var license = component.license;
    
    if (isBlank(license)) this.warn("should be set (MIT)");
  });
  
  return linter;
};

function isBlank(str) {
  return !str || !str.match(/\S/);
}

function hasExtension(str, ext) {
  return str.slice(-ext.length) === ext;
}

function isRepoFormat(str) {
  return str && str.split('/').length === 2;
}