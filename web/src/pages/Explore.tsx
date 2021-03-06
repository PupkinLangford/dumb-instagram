import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Explore.module.css';
import {useQuery} from '@apollo/client';
import {query_explore_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';
import CustomLoader from '../components/CustomLoader';

interface explorePost {
  id: string;
  author: string;
}

const Explore = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();

  const {
    loading: exploreQueryLoading,
    data: exploreQueryData,
  } = useQuery(query_explore_post, {variables: {count: 15}});

  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  if (exploreQueryLoading) {
    return <CustomLoader />;
  }

  return (
    <div className={`page ${styles.explore}`}>
      <main>
        <div className={styles.posts}>
          {exploreQueryData.explore_posts.map((post: explorePost) => (
            <Link to={'/posts/' + post.id} key={post.id}>
              <PostPic userID={post.author} postID={post.id} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
