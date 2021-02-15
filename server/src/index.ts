import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import cors from 'cors';
import config from './config';
import {connectDb} from './db';
import {GraphQLSchema} from 'graphql';
import {queryType} from './graphql/queries';
import {mutation} from './graphql/mutations';
const app = express();
const expressPlayground = require('graphql-playground-middleware-express')
  .default;

connectDb();

app.use(cors());
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutation,
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.get('/playground', expressPlayground({endpoint: '/graphql'}));
if (config.serverDatabase !== 'inmemory') {
  app.listen(config.serverPort, () => {
    console.log(`now listening for requests on port ${config.serverPort}`);
  });
}

export default app;
