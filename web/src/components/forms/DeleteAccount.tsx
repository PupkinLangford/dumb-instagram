import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import styles from './Forms.module.css';
import {useMutation} from '@apollo/client';
import {mutation_deleteSelf} from '../../graphql/mutations/user';
import {deleteAccountRules} from '../../rules/rules';
import {GraphQLError} from 'graphql';
import {useHistory} from 'react-router-dom';

const DeleteAccount = () => {
  const [deleteSelf] = useMutation(mutation_deleteSelf, {
    errorPolicy: 'all',
  });
  const history = useHistory();
  return (
    <Formik
      initialValues={{
        password: '',
        confirmation: '2',
      }}
      validationSchema={deleteAccountRules}
      onSubmit={async (values, {resetForm, setErrors}) => {
        const result = window.confirm(
          'Are you sure you want to delete your account? This action cannot be undone!'
        );
        if (result) {
          const {data, errors} = await deleteSelf({
            variables: {
              password: values.password,
            },
          });
          if (errors) {
            errors.forEach(error => {
              setErrors({
                password: ((error.message as unknown) as GraphQLError).message,
              });
            });
            return;
          }
          if (data.deleteSelf && data.deleteSelf.id) {
            localStorage.clear();
            history.go(0);
          }
        } else {
          resetForm();
        }
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
        <div role="group" className={styles.radioGroup}>
          <label htmlFor="radiogroup">
            Are you sure you wish to PERMANENTLY delete your account and photos?
          </label>
          <label className={styles.radioLabel}>
            <Field type="radio" name="confirmation" value="1" />
            Yes
          </label>
          <label className={styles.radioLabel}>
            <Field type="radio" name="confirmation" value="2" />
            No
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
