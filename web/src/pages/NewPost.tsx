import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './NewPost.module.css';
import {useMutation, useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {ErrorMessage, Field, Form, Formik} from 'formik';

const NewPost = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  return (
    <div className={`page ${styles.newPost}`}>
      <main>
        <Formik
          initialValues={{
            caption: '',
            location: '',
            file: null,
          }}
          onSubmit={async values => {
            console.log(values);
          }}
        >
          {props => (
            <Form>
              <input
                id="file"
                name="file"
                type="file"
                onChange={event => {
                  props.setFieldValue(
                    'file',
                    event.currentTarget.files
                      ? event.currentTarget.files[0]
                      : null
                  );
                }}
              />

              <label htmlFor="caption">Caption</label>
              <Field name="caption" component="textarea"></Field>

              <label htmlFor="location">Location</label>
              <Field name="location" type="text"></Field>

              <button type="submit" id={styles.submitButton}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default NewPost;
