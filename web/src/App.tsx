import React from 'react';
import './App.css';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import config from './config';
import Login from './pages/Login';
import Home from './pages/Home';
import Nav from './components/Nav';

const httpLink = createHttpLink({uri: config.serverUrl});

const authLink = setContext((_, {headers}) => {
  // https://www.apollographql.com/docs/react/networking/authentication/
  // call resetStore on login/logout, see docs
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Nav />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
