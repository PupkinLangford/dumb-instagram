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

- urls are superfluous properties. Post url could be a virtual property. Profile pic url could be stored as a constant on the front end.
- virtual properties for count of user posts/following/followers?
- delete photos from cloudinary when posts/users deleted
- change image size/quality/other cloudinary settings
- destroy token when user deleted
- going to need some privacy settings
- users could possibly manipulate url to find other user's private photos

#### Web Client

- loader spinner component
- return posts in reverse order of timestamp
- fix explicit any typing of post
- follow button functionality
- dont display follow button on own page, display link to settings
- refactor settings forms to separate components
- add delete account tab to settings
- profile picture being cached; clear cache when new picture uploaded
- prevent modalform parent click event from propagating to children
- reset cache on login/logout, change headers to not dump cache always
- set links in navbar dropdown
- search functionality
