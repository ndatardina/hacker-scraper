//unit tests to validate checkInputArguments

'use strict';

const
    chai = require('chai'),
    assert = chai.assert,
    validator = require('../lib/validate.js');
    
describe('checkInputArguments test', function () {

    it('empty arguments array should return error', function (done) {

        let args = [];        
        let actual;
        let expected = 'Please input the required arguments';

        try { 
            validator.checkInputArguments(args)
        } catch (error) {
            actual = error;
        }
        
        assert.deepEqual(expected, actual);
	
        done();
	
    });

});
	    
