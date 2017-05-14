import axios from 'axios';
import { expect } from 'chai';
import htmlparser from 'htmlparser2';

import StripFrame from '../src/StripFrame';
import { isArray } from '../src/utils';

const {
  frame: frameUrls,
  error: errorUrls
} = require('./_urls.json');

function getFrameData(arr) {
  if (!isArray(arr)) return [];
  const get = arr.map(o => (
    axios.get(o.url)
      .then(res => res.data)
      .then(string => ({ ...o, string }))
  ));
  return axios.all(get);
}

describe('StripFrame.js', () => {

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

  describe('Frameset Body String', () => {

    it('Get Frame Object', () => {
      frameData.forEach(({ string }) => {
        const sf = new StripFrame(string);
        expect(sf.frame()).to.have.deep.property('type', 'tag');
        expect(sf.frame()).to.have.deep.property('name', 'frame');
        expect(sf.frame()).to.not.have.deep.property('name', 'html');
      });
    });

    it('Get Frame URL', () => {
      frameData.forEach(({ string, equalUrl }) => {
        const sf = new StripFrame(string);
        expect(sf.url()).to.equal(equalUrl);
      });
    });

    it(`If not a <frameset> tag`, () => {
      errorData.forEach(({ string }) => {
        const sf = new StripFrame(string);
        expect(sf.frame()).to.equal(0);
        expect(sf.url()).to.be.null;
      });
    });

  });

  describe('`htmlparser2` DOM Array', () => {

    it('Get Frame Object', () => {
      frameData.forEach(({ string }) => {
        const domArray = htmlparser.parseDOM(string);
        const sf = new StripFrame(domArray);
        expect(sf.frame()).to.have.deep.property('type', 'tag');
        expect(sf.frame()).to.have.deep.property('name', 'frame');
        expect(sf.frame()).to.not.have.deep.property('name', 'html');
      });
    });

    it('Get Frame URL', () => {
      frameData.forEach(({ string, equalUrl }) => {
        const domArray = htmlparser.parseDOM(string);
        const sf = new StripFrame(domArray);
        expect(sf.url()).to.equal(equalUrl);
      });
    });

    it(`If not a <frameset> tag`, () => {
      errorData.forEach(({ string }) => {
        const domArray = htmlparser.parseDOM(string);
        const sf = new StripFrame(domArray);
        expect(sf.frame()).to.equal(0);
        expect(sf.url()).to.be.null;
      });
    });

  });

});
