import React, {useState, useEffect, useRef, MouseEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import config from '../config';
import {useAuth} from '../hooks/use_auth';
import styles from './EditProfile.module.css';
import {useMutation, useQuery} from '@apollo/client';
import {
  mutation_changeProfilePic,
  mutation_deleteProfilePic,
} from '../graphql/mutations/user';
import {query_current_user} from '../graphql/queries/user';

const EditProfile = () => {
  const [auth, loadingAuth] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [changeProfilePic] = useMutation(mutation_changeProfilePic);
  const [deleteProfilePic] = useMutation(mutation_deleteProfilePic);
  const {loading: queryLoading, data: queryData} = useQuery(query_current_user);
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
    console.log(queryData);
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [showModal]);

  if (queryLoading) return <div></div>;

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
          <Formik
            initialValues={{
              firstName: queryData.current_user.first_name,
              lastName: queryData.current_user.last_name,
              bio: queryData.current_user.bio,
              email: queryData.current_user.email,
              emailConfirm: queryData.current_user.email,
            }}
            onSubmit={values => console.table(values)}
          >
            <Form>
              <label htmlFor="firstName">First Name</label>
              <Field name="firstName" type="text"></Field>
              <ErrorMessage name="firstName"></ErrorMessage>

              <label htmlFor="lastName">Last Name</label>
              <Field name="lastName" type="text"></Field>
              <ErrorMessage name="lastName"></ErrorMessage>

              <label htmlFor="bio">Bio</label>
              <Field name="bio" component="textarea"></Field>
              <ErrorMessage name="bio"></ErrorMessage>

              <label htmlFor="email">Email</label>
              <Field name="email" type="email"></Field>
              <ErrorMessage name="email"></ErrorMessage>

              <label htmlFor="emailConfirm">Confirm Email</label>
              <Field name="emailConfirm" type="text"></Field>
              <ErrorMessage name="emailConfirm"></ErrorMessage>

              <button type="submit" id={styles.submitButton}>
                Submit
              </button>
            </Form>
          </Formik>
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
