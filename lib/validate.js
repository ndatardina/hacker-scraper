//this module contains functions used to validate parameters
//

'use strict;'

const validUrl = require('valid-url');

module.exports = {

    checkInputArguments : function (args) {
        
        if (args.length === 0 || args === undefined) {
            throw 'Please input the required arguments';
        }
        
        let errors = [];
        //check all input arguments. Call a different check for each argument
        
        args.forEach(function(argument, index) {
            if (inputChecks[index] != undefined) {
                inputChecks[index](errors, argument);
            } else {
                errors.push(
                    'argument ' + argument + ' at index ' + index + ' is invalid.');
            }  
        });

        //If errors have accumulated, make a single messages and throw
        if (errors.length > 0) {
            let output = 'Please fix the following errors:\n';
            errors.forEach(function (error) {
                output = output + '' + error + '\n';
            });
            throw output;
        }
    },

    truncateString : function (string, maxLength) {
        if (string) {
            if (string.length > maxLength) {
                return string.slice(0, maxLength);
            } else {
                return string;
            }
        } else {
            return 'undefined';
        }
    },

    coerceToPositiveInt : function (number) {
        if (typeof number === 'number' && number % 1 === 0 && number >= 0) {
            return number;
        } else {
            return 0; //coerce to 0, unspecified behaviour in this case
        }
    },

    validateUri : function (uri) {
        if (validUrl.isUri(uri)) { 
            return uri;
        } else {
            return 'invalid uri: ' + uri;
        }
    }
    
}


//***************************** PRIVATE *************************************//

//Array of functions to check each input argument
const inputChecks = [
    function (errors, argument) {
        if (argument != 'hackernews') {
            errors.push('unknown target');
        }
        return errors;
    },
    function (errors, argument) {
        if (argument != '--posts') {
            errors.push('argument "' + argument + '" is an invalid action');
        }
    },
    function (errors, argument) {
        const numberOfPosts = parseInt(argument);
        //number of posts specified as a positive integer <= 100
        if (typeof numberOfPosts === 'number' && 
                   numberOfPosts % 1 === 0 &&
                   numberOfPosts >= 1 && numberOfPosts <= 100) {
        } else {
            errors.push('argument "' + argument + '" is an invalid parameter');
        }
    }
];


