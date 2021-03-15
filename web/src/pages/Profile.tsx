import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Profile.module.css';
import {useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {query_user} from '../graphql/queries/user';

const Profile = () => {
  const [auth, loadingAuth] = useAuth();
  const {id} = useParams<{id: string}>();
  const history = useHistory();
  const {
    loading: userQueryLoading,
    data: userQueryData,
    error,
  } = useQuery(query_user, {variables: {id}});
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  if (userQueryLoading) {
    return <div></div>;
  }

  return (
    <div className={`page ${styles.profile}`}>
      {userQueryData.user.posts.length}
    </div>
  );
};

export default Profile;
