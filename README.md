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

- add feed_posts tests
- include own posts in feed
- explore_posts missing virtual properties of post
- virtual property for most recent comment on post; display in feed
- test for explore_posts
- Enable helmet before deployment
- urls are superfluous properties. Post url could be a virtual property. Profile pic url could be stored as a constant on the front end.
- virtual properties for count of user posts/following/followers?
- delete photos from cloudinary when users deleted
- destroy token when user deleted
- privacy settings (don't allow users to manipulate url to view private data)

#### Web Client

- search functionality
- click on own profile from own post, then click back => null map error
- pass props (existing caption/location) to EditPost; no need to re-query
- clear cached queries after edit/delete post mutations
- edit and delete own comments
- loader spinner component
- factor modals into separate components
- refactor settings forms to separate components
- fix explicit any typings in arrays of GraphQL data and PostFooterProps
- add delete account tab to settings
- profile picture being cached; clear cache when new picture uploaded
- prevent modalform parent click event from propagating to children
- reset cache on login/logout, change headers to not dump cache always
- use graphql subscriptions to avoid manual refresh
