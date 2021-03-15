import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Profile.module.css';
import {useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {query_user} from '../graphql/queries/user';
import config from '../config';

const Profile = () => {
  const [auth, loadingAuth] = useAuth();
  const {id} = useParams<{id: string}>();
  const history = useHistory();
  const {loading: userQueryLoading, data: userQueryData} = useQuery(
    query_user,
    {variables: {id}}
  );
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  if (userQueryLoading) {
    return <div></div>;
  }

  return (
    <div className={`page ${styles.profile}`}>
      <main>
        <header>
          <div className={styles.profilePic}>
            <ProfilePic source={id} />
          </div>
          <div className={styles.headline}>
            <h2>{userQueryData.user.username}</h2>
            <button type="button">Follow</button>
          </div>
        </header>
        <div className={styles.bio}>
          <h3>{`${userQueryData.user.first_name} ${userQueryData.user.last_name}`}</h3>
          <p>{userQueryData.user.bio}</p>
        </div>
        <div className={styles.posts}>
          {userQueryData.user.posts.map((post: any) => (
            <Link to={'/posts/' + post.id}>
              <img
                src={config.cloudinaryBaseUrl + `${id}/${post.id}`}
                alt="a post by the user"
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
