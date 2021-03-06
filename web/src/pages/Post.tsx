import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Post.module.css';
import {useQuery} from '@apollo/client';
import {query_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';
import Comment from '../components/Comment';
import PostFooter from '../components/PostFooter';
import PostHeader from '../components/PostHeader';
import CustomLoader from '../components/CustomLoader';
import {IComment} from '../types';

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
    return <CustomLoader />;
  }

  if (!postQueryLoading && (!postQueryData || !postQueryData.post)) {
    history.push('/');
    return null;
  }

  return (
    <div className={`page ${styles.post}`}>
      <main>
        <div className={styles.imageContainer}>
          <PostPic userID={postQueryData.post.author.id} postID={id} />
        </div>
        <div className={styles.dataContainer}>
          <PostHeader postData={postQueryData.post} />
          <div className={styles.commentContainer}>
            {postQueryData.post.caption && (
              <Comment
                parentID={id}
                authorID={postQueryData.post.author.id}
                parentAuthorID={postQueryData.post.author.id}
                authorUsername={postQueryData.post.author.username}
                content={postQueryData.post.caption}
                timestamp={postQueryData.post.format_date}
              />
            )}
            {postQueryData.post.comments.map((comment: IComment) => (
              <Comment
                key={comment.id}
                parentID={id}
                id={comment.id}
                authorID={comment.author.id}
                parentAuthorID={postQueryData.post.author.id}
                authorUsername={comment.author.username}
                content={comment.content}
                timestamp={comment.format_date}
              />
            ))}
          </div>
          <PostFooter postData={postQueryData.post} />
        </div>
      </main>
    </div>
  );
};

export default Post;
