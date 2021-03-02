import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';

const Home = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }
  return (
    <div className="home page">
      Home
      <button
        onClick={() => {
          localStorage.clear();
          history.go(0);
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
