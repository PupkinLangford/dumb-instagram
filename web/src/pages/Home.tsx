import React from 'react';
import {useHistory} from 'react-router-dom';
import {query_feed_posts} from '../graphql/queries/post';
import {useAuth} from '../hooks/use_auth';
import styles from './Home.module.css';
import {useQuery} from '@apollo/client';
import PostPreview from '../components/PostPreview';
import CustomLoader from '../components/CustomLoader';
import {IFollow, IPost} from '../types';

const Home = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  const {loading: feedQueryLoading, data: feedQueryData} = useQuery(
    query_feed_posts
  );

  if (feedQueryLoading || !feedQueryData) {
    return <CustomLoader />;
  }

  return (
    <div className={`page ${styles.home}`}>
      {feedQueryData.current_user.following
        .flatMap((f: IFollow) => f.posts)
        .concat(feedQueryData.current_user.posts)
        .sort(
          (a: IPost, b: IPost) =>
            +new Date(b.timestamp) - +new Date(a.timestamp)
        )
        .map((post: IPost) => (
          <PostPreview postData={post} key={post.id} />
        ))}
    </div>
  );
};

export default Home;
