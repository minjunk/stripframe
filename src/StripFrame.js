import htmlparser from 'htmlparser2';
import { findTag, isArray } from './utils';

export default class StripFrame {

  constructor(str) {
    this._url = null;
    this._dom = null;
    this._frame = null;

    if (typeof str === 'string' || isArray(str)) {
      this.load(str);
    }
  }

  load(str) {
    this.parseDOM(str);
    this.frame();
  }

  parseDOM(str) {
    if (this._dom) return;
    if (isArray(str)) {
      return this._dom = str;
    }
    return this._dom = htmlparser.parseDOM(str);
  }

  frame() {
    if (!this._dom) return;
    if (this._frame) return this._frame;
    const frame = this.findFrame(this._dom);
    return frame.length && frame[0];
  }

  attr(name) {
    var frame = this.frame();
    return (frame || null) && (name ? frame.attribs[name] : frame.attribs);
  }

  url() {
    return this.attr('src');
  }

  /**
   * frameset을 거쳐서 frame을 찾음
   * @param  {Array}  dom htmlparser Array
   * @return {Object}     찾은 frame 태그를 object로 반환
   */
  findFrame(dom) {
    // frameset를 탐색
    var frameset = findTag(dom, 'frameset');
    return frameset.map(fs => {
      var value = fs.attribs && (fs.attribs.rows || fs.attribs.cols),
          idx = this.frameIndex(value); // 사이즈를 비교해서 Index 선택
      if (fs.children && fs.children.length) {
        var fr = findTag(fs.children, 'frame');
        return fr[idx];
      }
    });
  }

  /**
   * frameset의 rows/cols 에서 발견된 value값으로
   * 값이 큰 frame의 index를 찾음
   * @param  {String} value rows/cols 값
   * @return {Number}       찾은 index 값
   */
  frameIndex(value) {
    const arr = value.toString().split(',')
      .map(value => value === '*' ? 100 : parseInt(value));

    // 최대 값을 구함
    const max = arr.reduce((prev, curr) => {
      return prev > curr ? prev : curr;
    });

    // Array에서 최대값을 대입해 Index를 찾음
    return arr.indexOf(max);
  }

}
