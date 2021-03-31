import React, {useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Post.module.css';
import {useMutation, useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {query_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';
import Comment from '../components/Comment';
import {mutation_deletePost} from '../graphql/mutations/post';
import PostFooter from '../components/PostFooter';

const Post = () => {
  const [auth, loadingAuth] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [deletePost] = useMutation(mutation_deletePost);
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

  if (!postQueryLoading && !postQueryData.post) {
    return <div></div>;
  }

  const submitDelete = async () => {
    const res = window.confirm('Are you sure you want to delete this post?');
    if (!res) return;
    try {
      await deletePost({variables: {post_id: id}});
      history.goBack();
      history.go(0);
    } catch (err) {
      console.log(err);
    }
  };

  const modal = (
    <div className={styles.cover} onClick={() => setShowModal(false)}>
      <div className={styles.modalBox}>
        <div className={styles.modalForm}>
          <div className={styles.modalButtons}>
            <Link to={`/posts/${id}/edit`} className={styles.modalLink}>
              <button style={{color: '#0095f6'}}>Edit Post</button>
            </Link>
            <button
              style={{color: '#ed4956', borderTop: '1px solid #dbdbdb'}}
              onClick={() => submitDelete()}
            >
              Delete Post
            </button>
            <button
              style={{fontWeight: 'normal', borderTop: '1px solid #dbdbdb'}}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`page ${styles.post}`}>
      <main>
        <div className={styles.imageContainer}>
          <PostPic userID={postQueryData.post.author.id} postID={id} />
        </div>
        <div className={styles.dataContainer}>
          <header>
            <div className={styles.profilePicContainer}>
              <ProfilePic source={postQueryData.post.author.id} />
            </div>
            <div className={styles.captionContainer}>
              <div className={styles.text}>
                <Link to={`/users/${postQueryData.post.author.id}`}>
                  <h2>{postQueryData.post.author.username}</h2>
                </Link>
                <p>{postQueryData.post.location}</p>
              </div>
              {postQueryData.post.author.id ===
              JSON.parse(localStorage.getItem('user')!)?.id ? (
                <div
                  className={styles.modalSwitch}
                  onClick={() => setShowModal(true)}
                >
                  ...
                </div>
              ) : null}
            </div>
          </header>
          <div className={styles.commentContainer}>
            {postQueryData.post.caption ? (
              <Comment
                authorID={postQueryData.post.author.id}
                authorUsername={postQueryData.post.author.username}
                content={postQueryData.post.caption}
                timestamp={postQueryData.post.format_date}
              />
            ) : null}
            {postQueryData.post.comments.map((comment: any) => (
              <Comment
                authorID={comment.author.id}
                authorUsername={comment.author.username}
                content={comment.content}
                timestamp={comment.format_date}
              />
            ))}
          </div>
          <PostFooter postData={postQueryData.post} />
        </div>
      </main>
      {showModal ? modal : null}
    </div>
  );
};

export default Post;
