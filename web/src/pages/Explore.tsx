import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Explore.module.css';
import {useQuery} from '@apollo/client';
import {query_explore_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';

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
    return <div></div>;
  }

  return (
    <div className={`page ${styles.explore}`}>
      <main>
        <div className={styles.posts}>
          {exploreQueryData.explore_posts.map((post: any) => (
            <Link to={'/posts/' + post.id} key={post.id}>
              <PostPic userID={post.author.id} postID={post.id} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
