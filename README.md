# Reflection
I decided to leave my fetch user component relatively unfinished to spend more of the alloted time on this documentation. Roughly 30mins was spent on this roundup.

## What went well
I got back into charting easily and found it enjoyable. VX works excellently and is brilliant when you know what you are doing. Before I began coding, I sat down for some time and mapped out the possible charts and graphs which I would consider building. Just simple note taking in notion but it allowed me to stay focused and not deviate on what I was making. Create React app was chosen for ease and suitability to client side rendering. This was the first time I had used Apollo, even though I have used GraphQL before in frameworks like Next and Gatsby. The overall process of using it was easy but I did run into some problems, outlined below. Material UI was used for simple things like inputs and progress wheels. Probably overkill but I think these small things pay off in this case. My code quality wasn't excellent but I think with the large amount of client-side data processing that needed to be done, with the limited time available I did what was necessary. Given more time I would have refactored multiple of the data parsing functions so that they are pure and can be re-used between components, which would likley cut down the amount of code by a fair amount.

## Even Better If 
When using Apollo, I found an infinte re-fetching loop when I had implemented the second chart. I tried multiple options to fix this, including forcing polling to stop, but the only thing which work was to stop Apollo caching any data. I believe the cause was perhaps each query updating the same object in cache and causing the other to refresh, but I'd have to read into Apollo more to understand it. The total number of posts to analyse was limited to 10,000 partly for this reason, but also because lots of the data processing is done on the client side. In a production environment, setting up the graphql server with filter and other query parameters would allow this frontend code to be much cleaner and run faster, therefore allowing us to work with more data, as I didnt want a huge wait time for the graphs to be produced. That being said, there are certainly optimisations which could be done on my code, given more time. As I mentioned above, I decided to stub my fetch user component and only have it return the name of some users. This was done with respect to the time I had remaining, especially as code would be repeated as there is no backwards link in the graphql api between users and their posts (so I would have to fetch posts again then filter them based on user on the client side). Still, the current get user function still shows a good example of calling data by id. Just as I am writing this I also discovered bug around the tooltip, whichever graph loads first will throw off the x position of the other graphs tooltip. Sure it is an easy fix by checking to see that the graph has rendered before rendering the tooltip. It can be fixed locally by resizing the browser window.

## Other notes
I did notice there were login options on this graphql schema. The given spec didnt mentioned anything about it so I decided not to touch it in my implementation. I did recently however complete a login system on a side project of mine, so take a look at quarter-life-frontend on my profile if you'd like to check that out. The main takeaways for me on this task are that VX is great, and that although Apollo is easy to use on the surface level, it is important to understand its power around caching and repeat-requests. 


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

To install the necessary packages.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

