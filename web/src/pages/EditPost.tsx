import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './NewPost.module.css';
import {useMutation} from '@apollo/client';
import {Field, Form, Formik} from 'formik';
import {mutation_updatePost} from '../graphql/mutations/post';
import PostPic from '../components/PostPic';
import {getCurrentUser} from '../utils';

const EditPost = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  const postData: any = (history.location && history.location.state) || {};
  const [updatePost, {loading}] = useMutation(mutation_updatePost);
  const {id} = useParams<{id: string}>();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  if (postData.authorID !== getCurrentUser()) {
    history.push('/');
  }

  return (
    <div className={`page ${styles.newPost}`}>
      <main>
        <Formik
          initialValues={{
            caption: postData && postData.caption,
            location: postData.location,
          }}
          onSubmit={async values => {
            try {
              const response = await updatePost({
                variables: {
                  post_id: id,
                  caption: values.caption,
                  location: values.location,
                },
              });
              history.push('/posts/' + response.data.updatePost.id);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <Form className={styles.postForm}>
            <div className={styles.preview}>
              <PostPic
                userID={postData.authorID}
                postID={id}
                style={{height: 'auto', maxWidth: '200px'}}
              />
            </div>
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

            <button type="submit" id={styles.submitButton} disabled={loading}>
              Submit
            </button>
          </Form>
        </Formik>
      </main>
    </div>
  );
};

export default EditPost;
