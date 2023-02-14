FROM node:16 AS build-stage
  
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci 
  
USER node

FROM node:16

COPY --from=build-stage /usr/src/app/build /usr/src/app/build

CMD npm start