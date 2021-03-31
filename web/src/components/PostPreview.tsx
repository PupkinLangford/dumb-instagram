import React from 'react';
import styles from './PostPreview.module.css';
import PostPic from '../components/PostPic';
import {Link} from 'react-router-dom';
import PostHeader from './PostHeader';

interface PostPreviewProps {
  postData: any;
}

const PostPreview = (props: any) => (
  <div className={styles.postPreview}>
    <PostHeader postData={props.postData} />
    <Link to={`/posts/${props.postData.id}`} className={styles.imageContainer}>
      <PostPic userID={props.postData.author.id} postID={props.postData.id} />
    </Link>
  </div>
);

export default PostPreview;
