import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import styles from './Forms.module.css';
import {useMutation} from '@apollo/client';
import {mutation_deleteSelf} from '../../graphql/mutations/user';
import {deleteAccountRules} from '../../rules/rules';

const DeleteAccount = () => {
  const [changePassword] = useMutation(mutation_deleteSelf);
  return (
    <Formik
      initialValues={{
        password: '',
        confirmation: '2',
      }}
      validationSchema={deleteAccountRules}
      onSubmit={async (values, {resetForm}) => {
        changePassword({
          variables: {
            password: values.password,
            confirmation: values.confirmation,
          },
        });
        alert('Password changed');
        resetForm();
      }}
      key="changePassword"
    >
      <Form className={styles.settingsForm}>
        <p>
          This will permanently delete your account, and all photos. This action
          CANNOT be undone.
        </p>
        <label htmlFor="password">Re-enter Password To Confirm Deletion</label>
        <Field name="password" type="password"></Field>
        <ErrorMessage
          name="password"
          component="div"
          className={styles.errors}
        />
        <div role="group">
          <label htmlFor="radiogroup">
            Are you sure you wish to PERMANENTLY delete your account and photos?
          </label>
          <label>
            <Field type="radio" name="confirmation" value="1" />
            yes
          </label>
          <label>
            <Field type="radio" name="confirmation" value="2" />
            no
          </label>
          <ErrorMessage
            name="confirmation"
            component="div"
            className={styles.errors}
          />
        </div>

        <button type="submit" id={styles.submitButton}>
          Submit
        </button>
      </Form>
    </Formik>
  );
};

export default DeleteAccount;
