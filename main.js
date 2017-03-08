//Hacker News Scraper. naeem datardina, 2017
//
//this is the entry point of the hacker news scraper app. The hacker news API
//is used to return the specified number of top posts in ascending order
//

'use strict;'

const
    logger = require('./lib/logger.js'), //logger for development & debug
    validator = require('./lib/validate.js'),
    hnews = require('hackfetch-js'),
    args = process.argv; //capture the input args

//set the log level. See logger.js for levels
logger.level = 'error';

//remove the first two arguments. These contain node.exe this script paths
args.splice(0,2);
logger.info(args);

try {
    validator.checkInputArguments(args);
} catch (error) {
    
    //don't use logger, this is part of the program
    console.log(error);
    return; //exit program
}

const numberOfPosts = parseInt(args[2]);
logger.info(numberOfPosts);

hnews.getTopItems().then(ids => {
    //return a promise so we can chain
    return new Promise((resolve, reject) => {

        ids = ids.splice(0, numberOfPosts);
        
        //create a promise for each id. We can wait for all of them to resolve
        //with Promise.all
        let promises = createPromises(ids, (resolve, reject, id, index) => {
                       
            hnews.getItemById(id).then(item => {
                //id array is ordered by rank (highest first) assign rank
                item.rank = index + 1;
                resolve(item);
            })
            .catch(error => {
                reject(error);
            });
        });

        logger.info('created promises, getting stories');

        Promise.all(promises).then((newsStories) => {
            logger.info('stories received, getting comments');
            resolve(newsStories);
        })
        .catch(error => {
            logger.error('error getting requested hacker news stories');
            reject(error);
        });
    });
    
}).then(newsStories => {

    return new Promise((resolve, reject) => {
        
        let promises = [];
        let newPromises;
        let noComments;

        newsStories.forEach(story => {
            story.comments = 0; //init comment counter 
            
            if(story.kids === undefined || story.kids.length === 0) {
                //no action to take here so just resolve with story as it needs
                //to be passed down the chain
                
                noComments = createNewPromise(resolve => {
                    resolve(story);
                });
                newPromises = [noComments];
            
            } else {
                newPromises = createPromises(story.kids, (resolve, reject, id, index) => {
                    hnews.getItemById(id).then(item => {
                        if (item != undefined && item.type === 'comment') {
                            story.comments++;
                        }
                        //a side effect is that we create duplicates of the story
                        //everytime a promise is resolved.
                        resolve(story);
                    }).catch(error => {
                        logger.error('error getting comment for id: ' + id);
                        reject(error);
                    });
                });
            }

            //collect all promises for all children. TODO the function above
            //should have some recursion or similar mechanism. Comments of comments
            //etc will no be captured in the final comment count. This will take
            //some further thought. 
            promises = promises.concat(newPromises);
        });

        Promise.all(promises).then((newsStories) => {

            //sort and filter the duplicates out
            newsStories.sort(function(a, b) {
                return a.rank - b.rank;
            });
            newsStories = newsStories.filter((item, position, arr) => {
                return arr.indexOf(item) == position;
            });
        
            resolve(newsStories);
        })
        .catch(error => {
            logger.error('error getting comments for news stories');
            reject(error);
        });
    });
}).then(newsStories => {
    
    let output = [];

    newsStories.forEach(story => {
    
        output.push({
            'title' : validator.truncateString(story.title),
            'uri' : validator.validateUri(story.url),
            'author' : validator.truncateString(story.by),
            'points' : validator.coerceToPositiveInt(story.score),
            'comments' : validator.coerceToPositiveInt(story.comments),
            'rank' : validator.coerceToPositiveInt(story.rank)
        });
    });

    console.log(output);
})
.catch(error => {
    logger.error('error getting hacker news');
    logger.error(error);
});



//******************** Utility Functions ***********************************//

//Wrapper function to allow the input callback to resolve or reject a promise
function createNewPromise(callback, id, index) {
    return new Promise((resolve, reject) => {
        callback(resolve, reject, id, index);
    });
};

//Wrapper function to create an array of promises which a sinle callback
function createPromises (ids, callback) {
    let promiseArray = [];
    ids.forEach(function (id, index) {
        promiseArray.push(createNewPromise(callback, id, index));
    });
    return promiseArray;
};

