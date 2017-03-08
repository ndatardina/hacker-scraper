# node.js hacker-scraper
This app scrapes the top stories from Hacker News using the HackerNews Firebase API. This app has been tested using cygwin on Windows7 x64.

### release notes
I decided to use the HackerNews Firebase API for this app as it looked like it could satisfy the requirements. This seemed preferable to me over the scraping of the HTML body directly from the HackerNews top story pages, as I felt that the extraction of data from html tags would be too susceptible to minor changes in the page. However, I have encountered a major issue that is currently unresolved. If the number of posts requested is too high the API returns connection timeout and reset errors (try 100 posts). Further work would need to be done to rectify this as the root cause is unknown. There is also an issue which I have decided not to resolve as I feel it is more important to send the app sooner rather than later. The issue is that the comment count is incorrect as the app only counts the comments directly on the story. It does not count nested comments, i.e. comments on comments. The use of the API meant that I have to make a request for each story and subsequent requests for each comment however the code needs some recursive mechanism to traverse through the children. This implementation is also slow. Overall, given this issue and the connection/ timeout issue I think the better route to complete the task would have been by requesting and parsing the html body. That being said, I do feel that the final app is a good reflection of my current JavaScript/ node level. It has been a good learning process.  

I have also created a simple single unit test to show capability, but again in the interests of prompt delivery have chosen not to create further tests. 

### installing and running
1. install node.js. This app has been developed for version v6.5.0 or greater https://nodejs.org/en/
2. check out the source code to a folder of your choice
3. open a command line interface and navigate to the source code folder
4. type "npm install" to install dependent libraries
5. type "node main.js hackernews --posts n" where n is an integer from 1 to 100
6. (optional) type "npm test" to execute unit tests


#### npm modules used
* winston. This is a useful logging tool that is useful for development and debugging. Messages can be logged at a number of messages and are timestamped.
* hackfetch-js. This is a simple wrapper for the HackerNews Firebase API. It was chosen as it returns a promise which can be easily chained to determine program flow when multiple asynchronous requests can be made.
* valid-url. This is a library that is used to validate the uri of each news story. It was chosen due to it's popularity on npm which implies robustness and accuracy.
* mocha. This is the unit test framework that I use. I have found it straightforward and effective to use.
* chai. This is the assertion library that I use for testing. I think I originally chose this as it contained some good object comparison functions that I needed.


