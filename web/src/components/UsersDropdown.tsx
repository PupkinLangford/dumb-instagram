import UserPreview from './UserPreview';
import styles from './UsersDropdown.module.css';

interface UserInfo {
  username: string;
  first_name: string;
  last_name: string;
  id: string;
}

interface UsersModalProps {
  userList: [
    {username: string; first_name: string; last_name: string; id: string}
  ];
}

const UsersDropdown = (props: UsersModalProps) =>
  props.userList.length > 0 ? (
    <div className={styles.cover}>
      <div className={styles.modalBox}>
        <div className={styles.modalForm}>
          {props.userList.map((user: UserInfo) => (
            <UserPreview key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  ) : null;

export default UsersDropdown;
