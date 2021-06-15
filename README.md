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

- feed query tests
- password reset
- privacy settings (don't allow users to manipulate url to view private data)
- Notifications

#### Web Client

- use subscriptions for home feed instead of history.go(0) in nav?
- useLogin hook to replace setLogin util. Abstract login mutation into hook.
- click anywhere outside nav modal to close it
- factor modals into separate components
- profile picture being cached; clear cache when new picture uploaded.
