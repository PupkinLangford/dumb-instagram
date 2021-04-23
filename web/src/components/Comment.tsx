import {useMutation} from '@apollo/client';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {mutation_deleteComment} from '../graphql/mutations/comment';
import {query_post} from '../graphql/queries/post';
import {getCurrentUser} from '../utils';
import styles from './Comment.module.css';
import ProfilePic from './ProfilePic';

interface CommentProps {
  authorID: string;
  parentAuthorID: string;
  parentID: string;
  authorUsername: string;
  content: string;
  timestamp: Date;
  id?: string;
}

const Comment = (props: CommentProps) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteComment] = useMutation(mutation_deleteComment, {
    refetchQueries: [{query: query_post, variables: {id: props.parentID}}],
  });
  const submitDelete = async () => {
    const res = window.confirm('Are you sure you want to delete this comment?');
    if (!res) return;
    try {
      await deleteComment({variables: {comment_id: props.id}});
    } catch (err) {
      console.log(err);
    }
  };

  const modal = (
    <div className={styles.cover} onClick={() => setShowModal(false)}>
      <div className={styles.modalBox}>
        <div className={styles.modalForm}>
          <div className={styles.modalButtons}>
            <button
              style={{color: '#ed4956', borderTop: '1px solid #dbdbdb'}}
              onClick={() => submitDelete()}
            >
              Delete Comment
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
    <div className={styles.comment}>
      <div className={styles.picContainer}>
        <ProfilePic source={props.authorID} />
      </div>
      <div className={styles.captionContainer}>
        <div>
          <div className={styles.text}>
            <Link to={`/users/${props.authorID}`}>
              <h2>{props.authorUsername}</h2>
            </Link>
            <p>{props.content}</p>
          </div>
        </div>
        <div className={styles.time}>{props.timestamp}</div>
      </div>
      {props.id &&
      (props.authorID === getCurrentUser() ||
        props.parentAuthorID === getCurrentUser()) ? (
        <div className={styles.modalSwitch} onClick={() => setShowModal(true)}>
          ...
        </div>
      ) : null}
      {showModal ? modal : null}
    </div>
  );
};

export default Comment;
