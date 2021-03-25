This is a personal project to build an end-to-end web app.

The original version of the listmaker web app was built in vanilla javascript, and can be found in the adventure-website repository. It is also hosted on Github Pages here: https://mel-lim.github.io/adventure-website/plan-adventure.html.

The present version of the web app is built in React. It is my first independent project in React. My 'independent', I mean, outside the scope of any tutorials or courses. 

At first commit, I am presenting a working front-end. 

In comparison with the earlier vanilla JS version, I have added two key functionalities:
1. Edit button - users can now edit the suggested list items by clicking the edit button to the left of the relevant list item. This will activate a text box where the user can edit the item name.
2. Undo delete button - users can now undo any deleted list items using the undo delete button located next to the add button at the bottom of each list.

Since my last independent project, I have learned about testing, specifically using Mocha and the Chai assertion library, and about test-driven development. This being my first independent React app, and having never developed my own tests independently, I decided to dig into the guts of the project without getting bogged down by also trying to figure out how to design and run tests. 

My next step is to learn Jest and design a test suite.

Update 24 March 2021

I have now implemented a front-end testing suite in Jest using React Testing Library. 

I have now also decided that I will create my database in PostgresSQL, and have designed the first version of the database schema. I note this schema accommodates phase 1 and phase 2 of this project.

Phase 1 is the individual, persistent listmaker app. A user creates a 'trip' and many lists per trip, e.g. a 'gear', 'clothing' and 'food' list. The user can create many 'trips', each with its own set of lists.

Phase 2 is the team-based, persistent listmaker app. A user creates a 'trip' and adds other users to the 'trip'. Each user has their own individual lists and can view their teammates' individual lists. The teammates also have a 'shared list' of communal items, which can optionally be allocated to a particular user (or left blank).

