var expect = require('node_modules/chai/chai.js').expect;
var registerUser = require('../script/register.js');

describe('Basic test', function(){	
	it('Should pass if test framework is working', function(){
		expect(true).to.be.true;
	})
	
	// it('Should be ableto register user with valid parameters', function(){
	// 	var random = Math.random(100, 500);
	// 	debugger;	
	// 	// registerUser('testuser' + random)
	// })
});