import styles from './PostPic.module.css';
import config from '../config';

interface PostPicProps {
  userID: string;
  postID: string;
}

const ProfilePic = (props: PostPicProps) => (
  <div className={styles.container}>
    <img
      src={config.cloudinaryBaseUrl + `${props.userID}/${props.postID}`}
      alt=""
    />
  </div>
);

export default ProfilePic;
