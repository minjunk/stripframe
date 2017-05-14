const StripFrame = require('./lib/StripFrame');

module.exports = function stripframe(str) {
  return new StripFrame(str);
};
