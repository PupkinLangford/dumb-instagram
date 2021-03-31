import React from 'react';
import styles from './PostPreview.module.css';
import PostPic from '../components/PostPic';
import {Link} from 'react-router-dom';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';

interface PostPreviewProps {
  postData: any;
}

const PostPreview = (props: PostPreviewProps) => (
  <div className={styles.postPreview}>
    <PostHeader postData={props.postData} />
    <Link to={`/posts/${props.postData.id}`} className={styles.imageContainer}>
      <PostPic userID={props.postData.author.id} postID={props.postData.id} />
    </Link>
    <PostFooter
      postData={props.postData}
      showCaption={!!props.postData.caption}
    />
  </div>
);

export default PostPreview;
