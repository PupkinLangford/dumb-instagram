import React from 'react';
import './App.css';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {createUploadLink} from 'apollo-upload-client';
import {setContext} from '@apollo/client/link/context';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import config from './config';
import Login from './pages/Login';
import Home from './pages/Home';
import Nav from './components/Nav';
import Settings from './pages/Settings';
import NewPost from './pages/NewPost';
import Profile from './pages/Profile';
import Post from './pages/Post';
import EditPost from './pages/EditPost';
import Explore from './pages/Explore';

const uploadLink = createUploadLink({uri: config.serverUrl});

const authLink = setContext((_, {headers}) => {
  // https://www.apollographql.com/docs/react/networking/authentication/
  // call resetStore on login/logout, see docs
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token || '',
      'Cache-Control': 'max-age=0, must-revalidate',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
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
          <Route exact path="/explore" component={Explore} />
          <Route exact path="/users/edit" component={Settings} />
          <Route exact path="/posts/new" component={NewPost} />
          <Route exact path="/posts/:id" component={Post} />
          <Route exact path="/posts/:id/edit" component={EditPost} />
          <Route exact path="/users/:id" component={Profile} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
