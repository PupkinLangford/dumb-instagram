import React, {useState, useEffect, useRef, MouseEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Formik} from 'formik';
import config from '../config';
import {useAuth} from '../hooks/use_auth';
import styles from './EditProfile.module.css';

const EditProfile = () => {
  const [auth, loadingAuth] = useAuth();
  const [showModal, setShowModal] = useState(false);
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

  const modal = (
    <div className={styles.cover} onClick={() => setShowModal(false)}>
      <div className={styles.modalBox}>
        <div className={styles.modalForm}>
          <h3>Change Profile Photo</h3>
          <div className={styles.buttons}>
            <button style={{color: '#0095f6'}} onClick={uploadProfilePic}>
              Upload Photo
            </button>
            <button style={{color: '#ed4956'}}>Remove Current Photo</button>
            <button style={{fontWeight: 'normal'}}>Cancel</button>
          </div>
        </div>
      </div>
      <input
        type="file"
        id="photoUpload"
        ref={photoUpload}
        style={{display: 'none'}}
      />
    </div>
  );

  return (
    <div className={`page ${styles.editProfile}`}>
      <main>
        <article>
          <div className={styles.headline}>
            <div className={styles.profilePic}>
              <img
                src={
                  config.cloudinaryBaseUrl +
                  JSON.parse(localStorage.getItem('user')!)?.id +
                  'profile_pic'
                }
                alt="user's profile pic"
              />
            </div>
            <div className={styles.title}>
              <h1>{JSON.parse(localStorage.getItem('user')!)?.username}</h1>
              <button onClick={() => setShowModal(true)}>
                Change Profile Photo
              </button>
            </div>
          </div>
        </article>
      </main>
      {showModal ? modal : null}
    </div>
  );
};

export default EditProfile;
