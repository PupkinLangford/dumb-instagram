import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useFormik} from 'formik';
import {useAuth} from '../hooks/use_auth';
import logo from '../images/logo.png';
import {loginRules, signUpRules} from '../rules/rules';
import './Login.module.css';
import styles from './Login.module.css';
import {useMutation} from '@apollo/client';
import {mutation_signup} from '../graphql/mutations/user';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [auth, loadingAuth] = useAuth();
  const [signUp, {data, loading}] = useMutation(mutation_signup);
  const history = useHistory();
  const formikLogin = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginRules,
    onSubmit: values => {
      console.log(values.username);
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
    onSubmit: async values => {
      await signUp({
        variables: {
          username: values.username,
          password: values.password,
          email: values.email,
          passwordConfirm: values.passwordConfirm,
        },
      });
      if (!data) {
        return;
      } else {
        console.log(data.signup.username);
        setShowLogin(true);
      }
    },
  });

  if (!loadingAuth && auth) {
    history.push('/');
  }

  const loginForm = (
    <form onSubmit={formikLogin.handleSubmit}>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formikLogin.handleChange}
        value={formikLogin.values.username}
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formikLogin.handleChange}
        value={formikLogin.values.password}
      />
      <button type="submit">Log In</button>
    </form>
  );

  const signupForm = (
    <form onSubmit={formikSignup.handleSubmit}>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.email}
      />
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.username}
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.password}
      />
      <input
        id="passwordConfirm"
        name="passwordConfirm"
        type="password"
        placeholder="Confirm Password"
        onChange={formikSignup.handleChange}
        value={formikSignup.values.passwordConfirm}
      />
      <button type="submit">Log In</button>
    </form>
  );

  return (
    <div className={styles.login}>
      <main>
        <div className={styles.formstuff}>
          <div id={styles.logo} style={{background: logo}}></div>
          {showLogin ? loginForm : signupForm}
        </div>
        <div className="switch">
          {showLogin ? (
            <p>
              Don't have an account?{' '}
              <span className={styles.link} onClick={() => setShowLogin(false)}>
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Have an account?{' '}
              <span className={styles.link} onClick={() => setShowLogin(true)}>
                Log in
              </span>
            </p>
          )}
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
