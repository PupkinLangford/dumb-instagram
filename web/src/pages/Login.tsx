import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useFormik} from 'formik';
import {useAuth} from '../hooks/use_auth';
import logo from '../images/logo.png';
import icon from '../images/di_icon.png';
import {loginRules, signUpRules} from '../rules/rules';
import './Login.module.css';
import styles from './Login.module.css';
import {useMutation} from '@apollo/client';
import {mutation_login, mutation_signup} from '../graphql/mutations/user';
import {GraphQLError} from 'graphql';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [auth, loadingAuth] = useAuth();
  const [signUp] = useMutation(mutation_signup, {errorPolicy: 'all'});
  const [userLogin] = useMutation(mutation_login, {errorPolicy: 'all'});
  const history = useHistory();
  const formikLogin = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginRules,

    onSubmit: async (values, {setErrors}) => {
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
        localStorage.setItem('token', data.login.token);
        history.push('/');
      }
    },
  });

  const formikSignup = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
    },
    validationSchema: signUpRules,
    onSubmit: async (values, {setErrors}) => {
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
        window.alert(`Successfully registered as ${data.signup.username}`);
        setShowLogin(true);
      }
    },
  });

  if (!loadingAuth && auth) {
    history.push('/');
  }

  const loginForm = (
    <form onSubmit={formikLogin.handleSubmit} className={styles.loginForm}>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formikLogin.handleChange}
        value={formikLogin.values.username}
      />
      {formikLogin.touched.username && formikLogin.errors.username ? (
        <div className={styles.errors}>{formikLogin.errors.username}</div>
      ) : null}
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formikLogin.handleChange}
        value={formikLogin.values.password}
      />
      {formikLogin.touched.password && formikLogin.errors.password ? (
        <div className={styles.errors}>{formikLogin.errors.password}</div>
      ) : null}
      <button type="submit">Log In</button>
    </form>
  );

  const signupForm = (
    <form onSubmit={formikSignup.handleSubmit} className={styles.loginForm}>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.email}
      />
      {formikSignup.touched.email && formikSignup.errors.email ? (
        <div className={styles.errors}>{formikSignup.errors.email}</div>
      ) : null}
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.username}
      />
      {formikSignup.touched.username && formikSignup.errors.username ? (
        <div className={styles.errors}>{formikSignup.errors.username}</div>
      ) : null}
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.password}
      />
      {formikSignup.touched.password && formikSignup.errors.password ? (
        <div className={styles.errors}>{formikSignup.errors.password}</div>
      ) : null}
      <input
        id="passwordConfirm"
        name="passwordConfirm"
        type="password"
        placeholder="Confirm Password"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.passwordConfirm}
      />
      {formikSignup.touched.passwordConfirm &&
      formikSignup.errors.passwordConfirm ? (
        <div className={styles.errors}>
          {formikSignup.errors.passwordConfirm}
        </div>
      ) : null}
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
    </form>
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
              {showLogin ? loginForm : signupForm}
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
          <p>There is no app yet</p>
        </div>
      </main>
      <footer>footer</footer>
    </div>
  );
};

export default Login;
