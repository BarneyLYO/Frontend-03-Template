//mocha is for node js, so require
const assert = require('assert');
//const add = require('../add');
//import add from '../add';
// const fun = require('../add');
import * as fun from '../add';

describe('function testing', () => {
	describe('pasitive', () => {
		it('1+2 should be 3', () => assert.equal(fun.add(1, 2), 3));
		//it('1*2 should be 2', () => assert.equal(fun.mul(1, 2), 2));
	});
	describe('nagative', () => {
		it('-5+ -2 should be -7', () => assert.equal(fun.add(-5, -2), -7));
		//it('-5 * -2 should be 10', () => assert.equal(fun.mul(-5, -2), 10));
	});
	describe('mix', () => {
		it('-5+2 should be -3', () => assert.equal(fun.add(-5, 2), -3));
		it('-5 * 2 should be -10', () => assert.equal(fun.mul(-5, 2), -10));
	});
});
