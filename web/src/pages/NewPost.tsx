import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './NewPost.module.css';
import {useMutation, useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikValues,
} from 'formik';
import {mutation_createPost} from '../graphql/mutations/post';

const NewPost = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [createPost] = useMutation(mutation_createPost);
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
          validate={values => {
            let errors: FormikErrors<FormikValues> = {};
            if (!values.file) {
              errors.file = 'File required';
            }
            return errors;
          }}
          onSubmit={async values => {
            try {
              const response = await createPost({
                variables: {
                  photo: values.file,
                  caption: values.caption,
                  location: values.location,
                },
              });
              console.log(response);
              const post_id = response.data.createPost.id;
              history.push('/posts/' + post_id);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          {props => (
            <Form className={styles.postForm}>
              <input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={event => {
                  const file = event.currentTarget.files
                    ? event.currentTarget.files[0]
                    : null;
                  props.setFieldValue('file', file);
                  file && setFileURL(URL.createObjectURL(file));
                }}
              />
              <ErrorMessage
                name="file"
                component="div"
                className={styles.errors}
              />
              {fileURL && (
                <div className={styles.preview}>
                  <img src={fileURL} alt="user's upload" />
                </div>
              )}
              <Field
                name="caption"
                component="textarea"
                placeholder="Write a caption..."
              ></Field>

              <label htmlFor="location">Location</label>
              <Field
                name="location"
                type="text"
                className={styles.location}
              ></Field>

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
