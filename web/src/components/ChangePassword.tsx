import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import styles from './SettingsForm.module.css';
import {useMutation} from '@apollo/client';
import {mutation_changePassword} from '../graphql/mutations/user';
import {changePasswordRules} from '../rules/rules';

const ChangePassword = () => {
  const [changePassword] = useMutation(mutation_changePassword);
  return (
    <Formik
      initialValues={{
        password: '',
        passwordConfirm: '',
      }}
      validationSchema={changePasswordRules}
      onSubmit={async (values, {resetForm}) => {
        changePassword({
          variables: {
            password: values.password,
            passwordConfirm: values.passwordConfirm,
          },
        });
        alert('Password changed');
        resetForm();
      }}
      key="changePassword"
    >
      <div className={styles.settingsForm}>
        <Form>
          <label htmlFor="password">New Password</label>
          <Field name="password" type="password"></Field>
          <ErrorMessage
            name="password"
            component="div"
            className={styles.errors}
          />

          <label htmlFor="passwordConfirm">Confirm New Password</label>
          <Field name="passwordConfirm" type="password"></Field>
          <ErrorMessage
            name="passwordConfirm"
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

export default ChangePassword;
