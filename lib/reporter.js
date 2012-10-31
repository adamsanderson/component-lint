var log = require('./utils').log;

/**
  * Expose the Reporter
  */
module.exports = Reporter;

/**
  * Creates a simple Reporter that listens to the `linter`.
  *
  * @param {Linter} linter
  * @param {Boolean} verbose
  * @api public
  */
function Reporter(linter, verbose){
  var reportedOn = {};
  
  if (verbose) {
    linter.on('done', function(topic){
      if (!reportedOn[topic]){
        log('ok', topic);
        reportedOn[topic] = true;
      }
    });
  }

  linter.on('warn', function(topic, message){
    log('warn', topic + ' ' + message);
    reportedOn[topic] = true;
  });

  linter.on('error', function(topic, error){
    log('error', topic + ' ' + error);
    reportedOn[topic] = true;
  });
}