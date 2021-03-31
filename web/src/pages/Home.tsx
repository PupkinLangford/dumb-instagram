import React from 'react';
import {useHistory} from 'react-router-dom';
import {query_feed_posts} from '../graphql/queries/post';
import {useAuth} from '../hooks/use_auth';
import styles from './Home.module.css';
import {useQuery} from '@apollo/client';
import PostPreview from '../components/PostPreview';

const Home = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  const {loading: feedQueryLoading, data: feedQueryData} = useQuery(
    query_feed_posts
  );

  if (feedQueryLoading) {
    return <div></div>;
  }

  return (
    <div className={`page ${styles.home}`}>
      {feedQueryData.feed_posts.map((post: any) => (
        <PostPreview postData={post} />
      ))}
    </div>
  );
};

export default Home;
