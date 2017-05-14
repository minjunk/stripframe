var StripFrame = require('./lib/StripFrame').default;

module.exports = function stripframe(str) {
  return new StripFrame(str);
};
