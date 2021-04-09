import UserPreview from './UserPreview';
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
          <UserPreview key={user.id} user={user} />
        ))}
      </div>
    </div>
  </div>
);

export default UsersModal;
