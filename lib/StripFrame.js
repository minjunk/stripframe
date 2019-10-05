'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _htmlparser = require('htmlparser2');

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StripFrame = function () {
  function StripFrame(str) {
    _classCallCheck(this, StripFrame);

    this._url = null;
    this._dom = null;
    this._frame = null;

    if (typeof str === 'string' || (0, _utils.isArray)(str)) {
      this.load(str);
    }
  }

  _createClass(StripFrame, [{
    key: 'load',
    value: function load(str) {
      this.parseDOM(str);
      this.frame();
    }
  }, {
    key: 'parseDOM',
    value: function parseDOM(str) {
      if (this._dom) return;
      if ((0, _utils.isArray)(str)) {
        return this._dom = str;
      }
      return this._dom = _htmlparser2.default.parseDOM(str);
    }
  }, {
    key: 'frame',
    value: function frame() {
      if (!this._dom) return;
      if (this._frame) return this._frame;
      var frame = this.findFrame(this._dom);
      return frame.length && frame[0];
    }

    /**
     * 찾은 프레임의 attribute를 반환
     * @param {String} name 반환 될 Attribute name
     * @return {String}
     */

  }, {
    key: 'attr',
    value: function attr(name) {
      var frame = this.frame();
      return (frame || null) && (name ? frame.attribs[name] : frame.attribs);
    }

    /**
     * 찾은 프레임의 src attribute를 반환
     * @return {String} this.attr('src')
     */

  }, {
    key: 'url',
    value: function url() {
      return this.attr('src');
    }

    /**
     * frameset을 거쳐서 frame을 찾음
     * @param {Array} dom htmlparser Array
     * @return {Object} 찾은 frame 태그를 object로 반환
     */

  }, {
    key: 'findFrame',
    value: function findFrame(dom) {
      var _this = this;

      // frameset를 탐색
      var frameset = (0, _utils.findTag)(dom, 'frameset');
      return frameset.map(function (fs) {
        var value = fs.attribs && (fs.attribs.rows || fs.attribs.cols),
            idx = _this.frameIndex(value); // 사이즈를 비교해서 Index 선택
        if (fs.children && fs.children.length) {
          var fr = (0, _utils.findTag)(fs.children, 'frame');
          return fr[idx];
        }
      });
    }

    /**
     * frameset의 rows/cols 에서 발견된 value값으로
     * 값이 큰 frame의 index를 찾음
     * @param {String} value rows/cols 값
     * @return {Number} 찾은 index 값
     */

  }, {
    key: 'frameIndex',
    value: function frameIndex(value) {
      var arr = value.toString().split(',').map(function (value) {
        return value === '*' ? 100 : parseInt(value);
      });

      // 최대 값을 구함
      var max = arr.reduce(function (prev, curr) {
        return prev > curr ? prev : curr;
      });

      // Array에서 최대값을 대입해 Index를 찾음
      return arr.indexOf(max);
    }
  }]);

  return StripFrame;
}();

exports.default = StripFrame;