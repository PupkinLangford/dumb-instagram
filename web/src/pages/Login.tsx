import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useAuth} from '../hooks/use_auth';
import logo from '../images/logo.png';
import icon from '../images/di_icon.png';
import {signUpRules} from '../rules/rules';
import './Login.module.css';
import styles from './Login.module.css';
import {useMutation} from '@apollo/client';
import {mutation_login, mutation_signup} from '../graphql/mutations/user';
import {GraphQLError} from 'graphql';
import {setLogin} from '../utils';
import LoginForm from '../components/forms/LoginForm';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [auth, loadingAuth] = useAuth();
  const [signUp] = useMutation(mutation_signup, {errorPolicy: 'all'});
  const [userLogin] = useMutation(mutation_login, {errorPolicy: 'all'});
  const history = useHistory();

  if (!loadingAuth && auth) {
    history.push('/');
  }

  const signupForm = (
    <Formik
      initialValues={{
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
      }}
      validationSchema={signUpRules}
      onSubmit={async (values, {setErrors}) => {
        const {data, errors} = await signUp({
          variables: {
            username: values.username,
            password: values.password,
            email: values.email,
            passwordConfirm: values.passwordConfirm,
          },
        });
        if (errors) {
          errors.forEach(error => {
            setErrors({
              username: ((error.message as unknown) as GraphQLError).message,
            });
          });
          return;
        } else {
          const {data: loginData} = await userLogin({
            variables: {
              username: data.signup.username,
              password: values.password,
            },
          });
          setLogin(loginData.login.token, loginData.login.user);
          history.push('/');
        }
      }}
      key="signUp"
    >
      <Form className={styles.loginForm}>
        <Field id="email" name="email" type="email" placeholder="Email" />
        <ErrorMessage name="email" component="div" className={styles.errors} />
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
        <Field
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          placeholder="Confirm Password"
        />
        <ErrorMessage
          name="passwordConfirm"
          component="div"
          className={styles.errors}
        />
        <button type="submit">Sign Up</button>
        <p className={styles.disclaimer}>
          By signing up, you agree to our{' '}
          <abbr title="A series of probably unenforceable rules backed by a binding arbitration clause">
            Terms
          </abbr>
          ,{' '}
          <abbr title="Any public or private data on any of your devices belongs to us">
            Data Policy
          </abbr>{' '}
          and{' '}
          <abbr title="User shall not bake any raisin-based cookies">
            Cookies Policy
          </abbr>{' '}
          .
        </p>
      </Form>
    </Formik>
  );

  return (
    <div className={styles.login}>
      <main className={styles.main}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div id={styles.icon} style={{backgroundImage: `url(${icon})`}}></div>
          <div>
            <div className={styles.formstuff}>
              <div
                id={styles.logo}
                style={{backgroundImage: `url(${logo})`}}
              ></div>
              {showLogin ? <LoginForm /> : signupForm}
            </div>
            <div className={styles.switch}>
              {showLogin ? (
                <p>
                  Don't have an account?{' '}
                  <span
                    className={styles.link}
                    onClick={() => setShowLogin(false)}
                  >
                    Sign up
                  </span>
                </p>
              ) : (
                <p>
                  Have an account?{' '}
                  <span
                    className={styles.link}
                    onClick={() => setShowLogin(true)}
                  >
                    Log in
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="getapp">
          <p>App coming soon</p>
        </div>
      </main>
    </div>
  );
};

export default Login;
