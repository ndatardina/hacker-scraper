//customisable logger 
//

'use strict'

const
    tsFormat = () => (new Date()).toLocaleTimeString(), 
    winston = require('winston'),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: tsFormat,
                prettyPrint: true, 
                colorize: true 
            })
        ]
});	    

//{error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5} 
logger.level = 'silly';

module.exports = logger;


