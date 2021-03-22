import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './NewPost.module.css';
import {useQuery, useMutation} from '@apollo/client';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikValues,
} from 'formik';
import {mutation_createPost} from '../graphql/mutations/post';
import {query_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';

const NewPost = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  const [createPost] = useMutation(mutation_createPost);
  const {id} = useParams<{id: string}>();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  const {loading: postQueryLoading, data: postQueryData} = useQuery(
    query_post,
    {variables: {id}}
  );

  if (postQueryLoading) {
    return <div></div>;
  }

  if (
    !postQueryLoading &&
    postQueryData.post.author.id !==
      JSON.parse(localStorage.getItem('user')!)?.id
  ) {
    history.push('/');
  }

  return (
    <div className={`page ${styles.newPost}`}>
      <main>
        <Formik
          initialValues={{
            caption: postQueryData.post.caption,
            location: postQueryData.post.location,
            file: null,
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
          <Form className={styles.postForm}>
            <div className={styles.preview}>
              <PostPic
                userID={postQueryData.post.author.id}
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

            <button type="submit" id={styles.submitButton}>
              Submit
            </button>
          </Form>
        </Formik>
      </main>
    </div>
  );
};

export default NewPost;
