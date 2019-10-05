'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// isArray
var isArray = Array.isArray || function (value) {
  return {}.toString.call(value) === '[object Array]';
};

/**
 * DOM에서 원하는 태그를 찾음
 * @param  {Array}  dom     htmlparser Array
 * @param  {String} tagName Tag name
 * @return {Array}          일치하는 태그
 */
function findTag(dom, tagName) {
  if (!isArray(dom)) return [];
  return dom.reduce(function (prev, curr) {
    if (curr.type === 'tag') {
      // TAG 형태만 허용
      if (curr.name === tagName) {
        // 선택된 TAG라면 반환
        return prev.concat(curr);
      } else if (curr.children && curr.children.length) {
        // 선택된 태그가 아닐 경우 하위 검색
        var child = findTag(curr.children, tagName);
        return prev.concat(child);
      }
    }
    return prev;
  }, []);
}

exports.findTag = findTag;
exports.isArray = isArray;