import React from 'react';
import {useHistory} from 'react-router-dom';
import {query_feed_posts} from '../graphql/queries/post';
import {useAuth} from '../hooks/use_auth';
import styles from './Home.module.css';
import {useQuery} from '@apollo/client';
import PostPreview from '../components/PostPreview';
import CustomLoader from '../components/CustomLoader';
import {IPost} from '../types';

const Home = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  const {
    loading: feedQueryLoading,
    data: feedQueryData,
    fetchMore,
  } = useQuery(query_feed_posts, {variables: {count: 2, offset: null}});

  if (feedQueryLoading || !feedQueryData) {
    return <CustomLoader />;
  }

  return (
    <div className={`page ${styles.home}`}>
      {feedQueryData.feed.map((post: IPost) => (
        <PostPreview postData={post} key={post.id} />
      ))}
      <button
        onClick={() =>
          fetchMore({
            variables: {
              count: 2,
              offset: feedQueryData.feed.slice(-1)[0].timestamp,
            },
            updateQuery: (prev: any, {fetchMoreResult}: any) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                feed: [...prev.feed, ...fetchMoreResult.feed.slice(1)],
              });
            },
          })
        }
      >
        fetch more
      </button>
    </div>
  );
};

export default Home;
