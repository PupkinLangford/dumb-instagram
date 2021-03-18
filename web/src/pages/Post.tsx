import React, {useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Post.module.css';
import {useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {query_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';
import Comment from '../components/Comment';

const Post = () => {
  const [auth, loadingAuth] = useAuth();
  const [newComment, setNewComment] = useState('');
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
            </div>
          </header>
          <div className={styles.commentContainer}>
            <Comment
              authorID={postQueryData.post.author.id}
              authorUsername={postQueryData.post.author.username}
              content={postQueryData.post.caption}
              timestamp={postQueryData.post.format_date}
            />
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
                aria-label="Like"
                fill="#262626"
                height="24"
                viewBox="0 0 48 48"
                width="24"
              >
                <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
              </svg>
            </span>
            <div className={styles.likes}>
              {postQueryData.post.likes.length} likes
            </div>
            <div className={styles.postTime}>
              {postQueryData.post.format_date}
            </div>
            <form className={styles.newComment}>
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              ></textarea>
              <button type="submit">Post</button>
            </form>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Post;
