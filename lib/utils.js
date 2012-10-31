/**
 * Log the given `type` with `msg`.
 *
 * @param {String} type
 * @param {String} msg
 * @api public
 */

exports.log = function(type, msg){
  var w = 10;
  var len = Math.max(0, w - type.length);
  var pad = Array(len + 1).join(' ');
  
  if ('error' == type) {
    console.error('  \033[31m%s\033[m : \033[90m%s\033[m', pad + type, msg);
  } else if ('warn' == type) {
    console.warn('  \033[33m%s\033[m : \033[90m%s\033[m', pad + type, msg);
  } else {
    console.log('  \033[36m%s\033[m : \033[90m%s\033[m', pad + type, msg);
  }
};