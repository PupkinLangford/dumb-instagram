import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';

const Home = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }
  return <div>Home</div>;
};

export default Home;
