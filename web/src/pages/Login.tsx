import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useFormik} from 'formik';
import {useAuth} from '../hooks/use_auth';
import logo from '../images/logo.png';
import {loginRules} from '../rules/rules';
import './Login.module.css';
import styles from './Login.module.css';

const Login = () => {
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginRules,
    onSubmit: values => {
      console.log(values.username);
    },
  });
  if (!loadingAuth && auth) {
    history.push('/');
  }
  return (
    <div className={styles.login}>
      <main>
        <div className={styles.loginform}>
          <div id={styles.logo} style={{background: logo}}></div>
          <form onSubmit={formik.handleSubmit}>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <button type="submit">Log In</button>
          </form>
        </div>
        <div className="signup">
          <p>
            Don't have an account? <Link to={'/signup'}>Sign up</Link>
          </p>
        </div>
        <div className="getapp">
          <p>Get the app.</p>
        </div>
      </main>
      <footer>footer</footer>
    </div>
  );
};

export default Login;
