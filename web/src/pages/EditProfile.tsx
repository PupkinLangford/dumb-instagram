import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import config from '../config';
import {useAuth} from '../hooks/use_auth';
import styles from './EditProfile.module.css';

const EditProfile = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

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
              <button>Change Profile Photo</button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default EditProfile;
