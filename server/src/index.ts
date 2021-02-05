import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import cors from 'cors';
import config from './config';
import {connectDb} from './db';
import {buildSchema} from 'graphql';
const app = express();
const expressPlayground = require('graphql-playground-middleware-express')
  .default;

connectDb();

app.use(cors());

//START
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get('/playground', expressPlayground({endpoint: '/graphql'}));
//END
app.listen(config.serverPort, () => {
  console.log(`now listening for requests on port ${config.serverPort}`);
});

export default app;
