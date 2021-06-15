import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import logo from '../images/logo.png';
import icon from '../images/di_icon.png';
import './Login.module.css';
import styles from './Login.module.css';
import LoginForm from '../components/forms/LoginForm';
import Signup from '../components/forms/Signup';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [auth, loadingAuth] = useAuth();
  const history = useHistory();

  if (!loadingAuth && auth) {
    history.push('/');
  }

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
              {showLogin ? <LoginForm /> : <Signup />}
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
