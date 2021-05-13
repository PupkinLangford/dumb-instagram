import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Settings.module.css';
import {useMutation, useQuery} from '@apollo/client';
import {
  mutation_changeProfilePic,
  mutation_deleteProfilePic,
} from '../graphql/mutations/user';
import {query_current_user} from '../graphql/queries/user';
import ProfilePic from '../components/ProfilePic';
import CustomLoader from '../components/CustomLoader';
import {getCurrentUser} from '../utils';
import EditProfile from '../components/forms/EditProfile';
import ChangePassword from '../components/forms/ChangePassword';
import DeleteAccount from '../components/forms/DeleteAccount';

const Settings = () => {
  const [auth, loadingAuth] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [changeProfilePic] = useMutation(mutation_changeProfilePic);
  const [deleteProfilePic] = useMutation(mutation_deleteProfilePic);
  const {loading: queryLoading, data: queryData} = useQuery(query_current_user);
  const FormType = {
    editProfile: <EditProfile current_user={queryData?.current_user} />,
    changePassword: <ChangePassword />,
    deleteAccount: <DeleteAccount />,
  };
  const [formDisplay, setFormDisplay] = useState(FormType.editProfile);
  const fileOnChange = async (files: FileList) => {
    try {
      await changeProfilePic({variables: {picture: files[0]}});
      window.alert(
        'Profile Pic successfully updated. Changes should be displayed in a few minutes.'
      );
    } catch (err) {
      console.log(err);
    }
  };
  const history = useHistory();
  const photoUpload = useRef<HTMLInputElement>(null);
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  const uploadProfilePic = () => {
    if (photoUpload.current) {
      photoUpload.current.click();
    }
  };

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [showModal]);

  if (queryLoading) return <CustomLoader />;

  const modal = (
    <div className={styles.cover} onClick={() => setShowModal(false)}>
      <div className={styles.modalBox}>
        <div className={styles.modalForm}>
          <h3>Change Profile Photo</h3>
          <div className={styles.buttons}>
            <button style={{color: '#0095f6'}} onClick={uploadProfilePic}>
              Upload Photo
            </button>
            <button
              style={{color: '#ed4956'}}
              onClick={() => deleteProfilePic()}
            >
              Remove Current Photo
            </button>
            <button style={{fontWeight: 'normal'}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`page ${styles.settings}`}>
      <main>
        <ul className={styles.optionsList}>
          <li onClick={() => setFormDisplay(FormType.editProfile)}>
            Edit Profile
          </li>
          <li onClick={() => setFormDisplay(FormType.changePassword)}>
            Change Password
          </li>
          <li onClick={() => setFormDisplay(FormType.deleteAccount)}>
            Delete Account
          </li>
        </ul>
        <article>
          <div className={styles.headline}>
            <div
              className={styles.profilePic}
              onClick={() => setShowModal(true)}
            >
              <ProfilePic source={getCurrentUser()} />
            </div>
            <div className={styles.title}>
              <h1>{JSON.parse(localStorage.getItem('user')!)?.username}</h1>
              <button onClick={() => setShowModal(true)}>
                Change Profile Photo
              </button>
            </div>
          </div>
          {formDisplay}
        </article>
      </main>
      {showModal ? modal : null}
      <input
        type="file"
        id="photoUpload"
        accept="image/*"
        ref={photoUpload}
        hidden
        onChange={e => fileOnChange(e.target.files!)}
      />
    </div>
  );
};

export default Settings;
