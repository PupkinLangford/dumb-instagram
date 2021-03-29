import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {query_following_posts} from '../graphql/queries/post';
import {useAuth} from '../hooks/use_auth';
import styles from './Home.module.css';
import {useQuery} from '@apollo/client';

const Home = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  const {loading: postsQueryLoading, data: postsQueryData} = useQuery(
    query_following_posts
  );

  if (postsQueryLoading) {
    return <div></div>;
  }

  return (
    <div className={`page ${styles.explore}`}>
      {console.log(postsQueryData)}
      <div>home</div>
    </div>
  );
};

export default Home;
