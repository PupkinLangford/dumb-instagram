import React, {FormEvent, useState} from 'react';
import styles from './PostFooter.module.css';
import {DocumentNode, useLazyQuery, useMutation} from '@apollo/client';
import {mutation_createComment} from '../graphql/mutations/comment';
import {
  mutation_likePost,
  mutation_unlikePost,
} from '../graphql/mutations/like';
import UsersModal from '../components/UsersModal';
import {Link} from 'react-router-dom';
import {query_post_likes} from '../graphql/queries/post';
import CustomLoader from './CustomLoader';
import {ILike, IPost} from '../types';

interface PostFooterProps {
  postData: IPost;
  showCaption?: boolean;
  query: DocumentNode;
}

const PostFooter = (props: PostFooterProps) => {
  const [newComment, setNewComment] = useState('');
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [createComment] = useMutation(mutation_createComment, {
    refetchQueries: [{query: props.query, variables: {id: props.postData.id}}],
  });
  const [likePost] = useMutation(mutation_likePost, {
    refetchQueries: [{query: props.query, variables: {id: props.postData.id}}],
  });
  const [unlikePost] = useMutation(mutation_unlikePost, {
    refetchQueries: [{query: props.query, variables: {id: props.postData.id}}],
  });
  const [getLikes, {loading: likesLoading, data: likesData}] = useLazyQuery(
    query_post_likes
  );

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment) {
      return;
    } else {
      await createComment({
        variables: {content: newComment, post_id: props.postData.id},
      });
      setNewComment('');
    }
  };
  const submitLike = () => {
    if (props.postData.isLiked) {
      return;
    }
    likePost({variables: {post_id: props.postData.id}});
  };

  const submitUnlike = () => {
    if (!props.postData.isLiked) {
      return;
    }
    unlikePost({variables: {post_id: props.postData.id}});
  };
  return (
    <footer className={styles.postFooter}>
      <span className={styles.likeButton}>
        <svg
          onClick={props.postData.isLiked ? submitUnlike : submitLike}
          aria-label="Like"
          fill={props.postData.isLiked ? '#ed4956' : '#262626'}
          height="24"
          viewBox="0 0 48 48"
          width="24"
        >
          <path
            d={
              props.postData.isLiked
                ? 'M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z'
                : 'M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z'
            }
          ></path>
        </svg>
      </span>
      <div
        className={styles.likes}
        onClick={() => {
          setShowLikesModal(true);
          getLikes({variables: {id: props.postData.id}});
        }}
      >
        {props.postData.likes_count} likes
      </div>
      {props.showCaption && (
        <div className={styles.text}>
          <Link to={`/users/${props.postData.author.id}`}>
            <h2>{props.postData.author.username}</h2>
          </Link>
          <p>{props.postData.caption}</p>
        </div>
      )}
      {props.postData.comments_count > 1 && (
        <div className={`${styles.commentsCount} ${styles.text}`}>
          <Link to={`/posts/${props.postData.id}`}>
            <span>{`View all ${props.postData.comments_count} comments`}</span>
          </Link>
        </div>
      )}
      {props.postData.last_comments && props.postData.last_comments.length > 0 && (
        <div className={styles.text} style={{marginTop: '4px'}}>
          <Link to={`/users/${props.postData.last_comments[0].author.id}`}>
            <h2>{props.postData.last_comments[0].author.username}</h2>
          </Link>
          <p>{props.postData.last_comments[0].content}</p>
        </div>
      )}
      <div className={styles.postTime}>{props.postData.format_date}</div>
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
      {showLikesModal && likesLoading ? <CustomLoader /> : null}
      {showLikesModal && likesData ? (
        <UsersModal
          closeModal={() => setShowLikesModal(false)}
          title="Likes"
          userList={likesData.post.likes.map((like: ILike) => like.liker)}
        />
      ) : null}
    </footer>
  );
};

export default PostFooter;
