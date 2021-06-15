import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import styles from './Forms.module.css';
import {useMutation} from '@apollo/client';
import {mutation_login} from '../../graphql/mutations/user';
import {loginRules} from '../../rules/rules';
import {GraphQLError} from 'graphql';
import {setLogin} from '../../utils';
import {useHistory} from 'react-router-dom';

const LoginForm = () => {
  const [userLogin] = useMutation(mutation_login, {errorPolicy: 'all'});
  const history = useHistory();
  return (
    <Formik
      initialValues={{username: '', password: ''}}
      validationSchema={loginRules}
      onSubmit={async (values, {setErrors}) => {
        const {data, errors} = await userLogin({
          variables: {
            username: values.username,
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
        } else {
          setLogin(data.login.token, data.login.user);
          history.push('/');
        }
      }}
      key="login"
    >
      <Form className={styles.loginForm}>
        <Field
          id="username"
          name="username"
          type="text"
          placeholder="Username"
        />
        <ErrorMessage
          name="username"
          component="div"
          className={styles.errors}
        />
        <Field
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
        <ErrorMessage
          name="password"
          component="div"
          className={styles.errors}
        />
        <button type="submit">Log In</button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
