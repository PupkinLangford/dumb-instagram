# Dumb Instagram

A fair use parody of Instagram.

## Tech Stack

- Typescript
- MongoDB
- Express
- React
- Node.js
- GraphQL

## Todo

#### Server

- user bio mutation
- urls are superfluous properties. Post url could be a virtual property. Profile pic url could be stored as a constant on the front end.
- find memory leak
- Helmet may be interfering with GrahpQL Playground
- delete photos from cloudinary when posts deleted
- delete photos and replace when pushed to same cloudinary URL
- change image size/quality/other cloudinary settings
- destroy token when user deleted
- going to need some privacy settings
- users could possibly manipulate url to find other user's private photos

#### Web Client

- refactor profile picture into reusable component, prop -> user_id
- profile picture being cached; clear cache when new picture uploaded
- prevent modalform parent click event from propagating to children
- reset cache on login/logout
- set links in navbar dropdown
- search functionality
