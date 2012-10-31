var log = require('./utils').log;

module.exports = Reporter;

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