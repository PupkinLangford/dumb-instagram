import React, {useEffect} from 'react';
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
  } = useQuery(query_feed_posts, {variables: {count: 5, offset: null}});

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;
      if (bottom) {
        fetchMore({
          variables: {
            count: 5,
            offset: feedQueryData.feed.slice(-1)[0]?.timestamp,
          },
        });
      }
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [feedQueryData, fetchMore]);

  if (feedQueryLoading || !feedQueryData) {
    return <CustomLoader />;
  }

  return (
    <div className={`page ${styles.home}`}>
      {feedQueryData.feed.map((post: IPost) => (
        <PostPreview postData={post} key={post.id} />
      ))}
    </div>
  );
};

export default Home;
