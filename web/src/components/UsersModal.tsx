import {Link} from 'react-router-dom';
import ProfilePic from './ProfilePic';
import styles from './UsersModal.module.css';

interface IUser {
  username: string;
  first_name: string;
  last_name: string;
  id: string;
}

interface UsersModalProps {
  closeModal: () => void;
  title: string;
  userList: [
    {username: string; first_name: string; last_name: string; id: string}
  ];
}

const UsersModal = (props: UsersModalProps) => (
  <div className={styles.cover} onClick={props.closeModal}>
    <div className={styles.modalBox}>
      <div className={styles.modalForm}>
        <h1>{props.title}</h1>
        {props.userList.map((user: IUser) => (
          <div className={styles.user} key={user.id}>
            <div className={styles.picContainer}>
              <ProfilePic source={user.id} />
            </div>
            <div className={styles.captionContainer}>
              <div className={styles.text}>
                <Link to={`/users/${user.id}`}>
                  <h2>{user.username}</h2>
                </Link>
              </div>
              <div
                className={styles.name}
              >{`${user.first_name} ${user.last_name}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UsersModal;
