let assert = require("assert");
import {add, m} from '../add';
// let add = require('../add').add;
// let m = require('../add').m;

describe('add function testing', () => {
  it(' 1 add 2 should be 3', function() {
    assert.equal(add(1,2), 3);
  });
  
  it(' -5 add 2 should be -3', function() {
    assert.equal(add(-5,2), -3);
  });
  
});


describe('m function testing', () => {
  it(' 1 m 2 should be 2', function() {
    assert.equal(m(1,2), 2);
  });
});


