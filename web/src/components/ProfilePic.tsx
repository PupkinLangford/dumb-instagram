import styles from './ProfilePic.module.css';
import config from '../config';

interface ProfilePicProps {
  source: string;
}

const ProfilePic = (props: ProfilePicProps) => (
  <div className={styles.container}>
    <img
      src={
        config.cloudinaryBaseUrl + props.source + '/profile_pic#' + Date.now()
      }
      alt="user's profile pic"
    />
  </div>
);

export default ProfilePic;
