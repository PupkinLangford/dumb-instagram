import React, {useState, useEffect, useRef, MouseEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Formik} from 'formik';
import config from '../config';
import {useAuth} from '../hooks/use_auth';
import styles from './EditProfile.module.css';
import {useMutation} from '@apollo/client';
import {
  mutation_changeProfilePic,
  mutation_deleteProfilePic,
} from '../graphql/mutations/user';

const EditProfile = () => {
  const [auth, loadingAuth] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [changeProfilePic] = useMutation(mutation_changeProfilePic);
  const [deleteProfilePic] = useMutation(mutation_deleteProfilePic);
  const fileOnChange = async (files: FileList) => {
    try {
      const {data} = await changeProfilePic({variables: {picture: files[0]}});
      console.log(data);
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
    <div className={`page ${styles.editProfile}`}>
      <main>
        <article>
          <div className={styles.headline}>
            <div className={styles.profilePic}>
              <img
                src={
                  config.cloudinaryBaseUrl +
                  JSON.parse(localStorage.getItem('user')!)?.id +
                  '/profile_pic#' +
                  Date.now()
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
      <input
        type="file"
        id="photoUpload"
        ref={photoUpload}
        hidden
        onChange={e => fileOnChange(e.target.files!)}
      />
    </div>
  );
};

export default EditProfile;
