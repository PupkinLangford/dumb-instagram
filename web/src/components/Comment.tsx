import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Comment.module.css';
import ProfilePic from './ProfilePic';

interface CommentProps {
  authorID: string;
  authorUsername: string;
  content: string;
  timestamp: Date;
}

const Comment = (props: CommentProps) => {
  return (
    <div className={styles.comment}>
      <div className={styles.picContainer}>
        <ProfilePic source={props.authorID} />
      </div>
      <div className={styles.captionContainer}>
        <div className={styles.text}>
          <Link to={`/users/${props.authorID}`}>
            <h2>{props.authorUsername}</h2>
          </Link>
          <p>{props.content}</p>
        </div>
        <div className={styles.time}>{props.timestamp}</div>
      </div>
    </div>
  );
};

export default Comment;
