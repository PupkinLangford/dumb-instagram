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

- privacy settings (don't allow users to manipulate url to view private data)
- Notifications

#### Web Client

- modify follow/unfollow to return data to update cache
- Delete comment refetches entire query.
- handle history.go(0) in PostHeader, Nav, and EditPost
- pagination on home page/feed
- pass props (existing caption/location) to EditPost; no need to re-query
- factor modals into separate components
- refactor settings forms to separate components
- add delete account tab to settings
- profile picture being cached; clear cache when new picture uploaded.
- prevent modalform parent click event from propagating to children
