import React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './NewPost.module.css';
import {useQuery, useMutation} from '@apollo/client';
import {Field, Form, Formik} from 'formik';
import {mutation_updatePost} from '../graphql/mutations/post';
import {query_post} from '../graphql/queries/post';
import PostPic from '../components/PostPic';
import CustomLoader from '../components/CustomLoader';

const NewPost = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  const [updatePost] = useMutation(mutation_updatePost);
  const {id} = useParams<{id: string}>();
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  const {loading: postQueryLoading, data: postQueryData} = useQuery(
    query_post,
    {variables: {id}}
  );

  if (postQueryLoading) {
    return <CustomLoader />;
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
              history.go(0);
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
