import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useFormik} from 'formik';
import {useAuth} from '../hooks/use_auth';
import logo from '../images/logo.png';
import {loginRules, signUpRules} from '../rules/rules';
import './Login.module.css';
import styles from './Login.module.css';
import {useMutation} from '@apollo/client';
import {mutation_login, mutation_signup} from '../graphql/mutations/user';

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

    onSubmit: async values => {
      const {data, errors} = await userLogin({
        variables: {
          username: values.username,
          password: values.password,
        },
      });
      if (!data.login) {
        errors?.forEach(e => console.log((e as any).message.message));
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
    onSubmit: async values => {
      const {data, errors} = await signUp({
        variables: {
          username: values.username,
          password: values.password,
          email: values.email,
          passwordConfirm: values.passwordConfirm,
        },
      });
      if (!data) {
        console.log(errors);
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
    </form>
  );

  return (
    <div className={styles.login}>
      <main className={styles.main}>
        <div className={styles.formstuff}>
          <div id={styles.logo} style={{backgroundImage: `url(${logo})`}}></div>
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
