import {Link} from 'react-router-dom';
import ProfilePic from './ProfilePic';
import styles from './UserPreview.module.css';

interface UserPreviewProps {
  user: {username: string; first_name: string; last_name: string; id: string};
}

const UserPreview = (props: UserPreviewProps) => {
  return (
    <Link to={`/users/${props.user.id}`}>
      <div className={styles.user}>
        <div className={styles.picContainer}>
          <ProfilePic source={props.user.id} />
        </div>
        <div className={styles.captionContainer}>
          <div className={styles.text}>
            <h2>{props.user.username}</h2>
          </div>
          <div
            className={styles.name}
          >{`${props.user.first_name} ${props.user.last_name}`}</div>
        </div>
      </div>
    </Link>
  );
};

export default UserPreview;
