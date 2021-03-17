import React from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Post.module.css';
import {useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {query_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';

const Post = () => {
  const [auth, loadingAuth] = useAuth();
  const {id} = useParams<{id: string}>();
  const history = useHistory();

  const {loading: postQueryLoading, data: postQueryData} = useQuery(
    query_post,
    {variables: {id}}
  );
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  if (postQueryLoading) {
    return <div></div>;
  }

  return (
    <div className={`page ${styles.post}`}>
      <main>
        <div className={styles.imageContainer}>
          <PostPic userID={postQueryData.post.author.id} postID={id} />
        </div>
        <div className={styles.dataContainer}>{postQueryData.post.caption}</div>
      </main>
    </div>
  );
};

export default Post;
