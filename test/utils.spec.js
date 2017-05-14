import axios from 'axios';
import { expect } from 'chai';
import htmlparser from 'htmlparser2';

import { findTag, isArray } from '../src/utils';

const {
  frame: frameUrls,
  error: errorUrls
} = require('./_urls.json');

function getFrameData(arr) {
  if (!isArray(arr)) return [];
  const getData = arr.map(o => axios.get(o.url).then(res => res.data));
  return axios.all(getData);
}

describe('utils.js', () => {

  let frameData;
  let errorData;
  before('Get Frame string data', () => {
    return getFrameData(frameUrls)
      .then(data => {
        expect(data).to.have.lengthOf(frameUrls.length);
        frameData = data;
        return true;
      })
      .then(() => getFrameData(errorUrls))
      .then(data => {
        expect(data).to.have.lengthOf(errorUrls.length);
        errorData = data;
        return true;
      });
  });

  describe('findTag()', () => {

    // frameset
    it(`findTag({htmlparser2 domArray}, 'frameset')`, () => {
      frameData.forEach(data => {
        const dom = htmlparser.parseDOM(data);
        expect(findTag(dom, 'frameset')).to.have.lengthOf(1);
        expect(findTag(dom, 'frameset')).to.have.deep.property('[0].type', 'tag');
        expect(findTag(dom, 'frameset')).to.have.deep.property('[0].name', 'frameset');
      });
    });

    it(`findTag({htmlparser2 domArray}, 'frame')`, () => {
      frameData.forEach((data, idx) => {
        const dom = htmlparser.parseDOM(data);
        expect(findTag(dom, 'frame')).to.have.lengthOf(idx === 0 ? 1 : 2);
        expect(findTag(dom, 'frame')).to.have.deep.property('[0].type', 'tag');
        expect(findTag(dom, 'frame')).to.have.deep.property('[0].name', 'frame');
      });
    });

    // Not a frameset
    it(`If not a <frameset> tag`, () => {
      errorData.forEach(data => {
        const dom = htmlparser.parseDOM(data);
        expect(findTag(dom, 'frameset')).to.have.lengthOf(0);
        expect(findTag(dom, 'frame')).to.have.lengthOf(0);
      });
    });

  });

});
