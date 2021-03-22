import React, {FormEvent, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Post.module.css';
import {useMutation, useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {query_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';
import Comment from '../components/Comment';
import {mutation_createComment} from '../graphql/mutations/comment';
import {
  mutation_likePost,
  mutation_unlikePost,
} from '../graphql/mutations/like';
import {mutation_deletePost} from '../graphql/mutations/post';

const Post = () => {
  const [auth, loadingAuth] = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deletePost] = useMutation(mutation_deletePost);
  const [createComment] = useMutation(mutation_createComment);
  const [likePost] = useMutation(mutation_likePost);
  const [unlikePost] = useMutation(mutation_unlikePost);
  const {id} = useParams<{id: string}>();
  const history = useHistory();

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment) {
      return;
    } else {
      await createComment({variables: {content: newComment, post_id: id}});
      history.go(0);
    }
  };

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

  const liked = postQueryData.post.likes.some(
    (like: any) =>
      like.liker.id === JSON.parse(localStorage.getItem('user')!)?.id
  );

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

  const submitLike = async () => {
    if (liked) {
      return;
    }
    await likePost({variables: {post_id: id}});
    history.go(0);
  };

  const submitUnlike = async () => {
    if (!liked) {
      return;
    }
    await unlikePost({variables: {post_id: id}});
    history.go(0);
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
                <Link to={`/users/${id}`}>
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
          <footer>
            <span className={styles.likeButton}>
              <svg
                onClick={liked ? submitUnlike : submitLike}
                aria-label="Like"
                fill={liked ? '#ed4956' : '#262626'}
                height="24"
                viewBox="0 0 48 48"
                width="24"
              >
                <path
                  d={
                    liked
                      ? 'M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z'
                      : 'M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z'
                  }
                ></path>
              </svg>
            </span>
            <div className={styles.likes}>
              {postQueryData.post.likes.length} likes
            </div>
            <div className={styles.postTime}>
              {postQueryData.post.format_date}
            </div>
            <form className={styles.newComment} onSubmit={submitComment}>
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              ></textarea>
              <button type="submit" disabled={!newComment}>
                Post
              </button>
            </form>
          </footer>
        </div>
      </main>
      {showModal ? modal : null}
    </div>
  );
};

export default Post;
