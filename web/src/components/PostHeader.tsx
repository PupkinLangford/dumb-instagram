import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import styles from './PostHeader.module.css';
import {useMutation} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {mutation_deletePost} from '../graphql/mutations/post';
import {getCurrentUser} from '../utils';
import {IPost} from '../types';

interface PostHeaderProps {
  postData: IPost;
}

const PostHeader = (props: PostHeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const [deletePost] = useMutation(mutation_deletePost);
  const history = useHistory();
  const submitDelete = async () => {
    const res = window.confirm('Are you sure you want to delete this post?');
    if (!res) return;
    try {
      await deletePost({variables: {post_id: props.postData.id}});
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
            <Link
              to={`/posts/${props.postData.id}/edit`}
              className={styles.modalLink}
            >
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
    <header className={styles.postHeader}>
      <div className={styles.profilePicContainer}>
        <ProfilePic source={props.postData.author.id} />
      </div>
      <div className={styles.captionContainer}>
        <div className={styles.text}>
          <Link to={`/users/${props.postData.author.id}`}>
            <h2>{props.postData.author.username}</h2>
          </Link>
          <p>{props.postData.location}</p>
        </div>
        {props.postData.author.id === getCurrentUser() ? (
          <div
            className={styles.modalSwitch}
            onClick={() => setShowModal(true)}
          >
            ...
          </div>
        ) : null}
      </div>
      {showModal ? modal : null}
    </header>
  );
};

export default PostHeader;
