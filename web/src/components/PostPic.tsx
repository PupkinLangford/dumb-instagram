import styles from './PostPic.module.css';
import config from '../config';
import {React} from '@ungap/global-this';

interface PostPicProps {
  userID: string;
  postID: string;
  style?: React.CSSProperties;
}

const ProfilePic = (props: PostPicProps) => (
  <div className={styles.container} style={props.style}>
    <img
      src={config.cloudinaryBaseUrl + `${props.userID}/${props.postID}`}
      alt=""
    />
  </div>
);

export default ProfilePic;
