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

#### Web Client

- pass props (existing caption/location) to EditPost; no need to re-query
- rerun queries after edit/delete post mutations
- factor modals into separate components
- refactor settings forms to separate components
- add delete account tab to settings
- profile picture being cached; clear cache when new picture uploaded.
- prevent modalform parent click event from propagating to children
- use graphql subscriptions to avoid manual refresh
