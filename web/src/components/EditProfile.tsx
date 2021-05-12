import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import styles from './SettingsForm.module.css';
import {useMutation} from '@apollo/client';
import {mutation_editProfile} from '../graphql/mutations/user';
import {editProfileRules} from '../rules/rules';

interface EditProfileProps {
  current_user:
    | {
        first_name: string | undefined;
        last_name: string | undefined;
        bio: string | undefined;
        email: string | undefined;
      }
    | undefined;
}

const EditProfile = (props: EditProfileProps) => {
  const [updateProfile] = useMutation(mutation_editProfile);
  const {first_name, last_name, bio, email} = props.current_user || {};
  return (
    <Formik
      initialValues={{
        firstName: first_name,
        lastName: last_name,
        bio: bio,
        email: email,
        emailConfirm: email,
      }}
      validationSchema={editProfileRules}
      onSubmit={async values => {
        updateProfile({
          variables: {
            first_name: values.firstName,
            last_name: values.lastName,
            bio: values.bio,
            email: values.email,
            emailConfirm: values.emailConfirm,
          },
        });
        alert('Profile updated');
      }}
      key="editProfile"
    >
      <div className={styles.settingsForm}>
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" type="text"></Field>
          <ErrorMessage
            name="firstName"
            component="div"
            className={styles.errors}
          />

          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" type="text"></Field>
          <ErrorMessage
            name="lastName"
            component="div"
            className={styles.errors}
          />

          <label htmlFor="bio">Bio</label>
          <Field name="bio" component="textarea"></Field>
          <ErrorMessage name="bio" component="div" className={styles.errors} />

          <label htmlFor="email">Email</label>
          <Field name="email" type="email" required></Field>
          <ErrorMessage
            name="email"
            component="div"
            className={styles.errors}
          />

          <label htmlFor="emailConfirm">Confirm Email</label>
          <Field name="emailConfirm" type="text" required></Field>
          <ErrorMessage
            name="emailConfirm"
            component="div"
            className={styles.errors}
          />

          <button type="submit" id={styles.submitButton}>
            Submit
          </button>
        </Form>
      </div>
    </Formik>
  );
};

export default EditProfile;
