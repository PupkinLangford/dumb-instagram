import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useFormik} from 'formik';
import {useAuth} from '../hooks/use_auth';
import logo from '../images/logo.png';
import {loginRules} from '../rules/rules';
import './Login.module.css';

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
    <div className="login">
      <img src={logo} alt="logo" />
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
