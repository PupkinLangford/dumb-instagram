import React, {useEffect} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Profile.module.css';
import {useMutation, useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {query_user} from '../graphql/queries/user';
import PostPic from '../components/PostPic';
import {
  mutation_followUser,
  mutation_unfollowUser,
} from '../graphql/mutations/follow';

const Profile = () => {
  const [auth, loadingAuth] = useAuth();
  const {id} = useParams<{id: string}>();
  const history = useHistory();
  const [followUser] = useMutation(mutation_followUser);
  const [unfollowUser] = useMutation(mutation_unfollowUser);
  const {loading: userQueryLoading, data: userQueryData} = useQuery(
    query_user,
    {variables: {id}}
  );

  useEffect(() => {
    if (!userQueryLoading) console.log(userQueryData);
  });
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  if (userQueryLoading) {
    return <div></div>;
  } else {
    const following = userQueryData.user.followers.some(
      (f: any) =>
        f.follower.id === JSON.parse(localStorage.getItem('user')!)?.id
    );

    const submitFollow = async () => {
      if (following) {
        return;
      }
      await followUser({variables: {user_id: id}});
      history.go(0);
    };

    const submitUnfollow = async () => {
      if (!following) {
        return;
      }
      await unfollowUser({variables: {user_id: id}});
      history.go(0);
    };

    const followButton = following ? (
      <button
        type="button"
        onClick={() => submitUnfollow()}
        id={styles.unfollow}
      >
        Unfollow
      </button>
    ) : (
      <button type="button" onClick={() => submitFollow()}>
        Follow
      </button>
    );

    return (
      <div className={`page ${styles.profile}`}>
        <main>
          <header>
            <div className={styles.profilePic}>
              <ProfilePic source={id} />
            </div>
            <div className={styles.headline}>
              <h2>{userQueryData.user.username}</h2>
              {id === JSON.parse(localStorage.getItem('user')!).id ? (
                <Link to="/users/edit">
                  <button type="button" id={styles.editButton}>
                    Edit Profile
                  </button>
                </Link>
              ) : (
                followButton
              )}
            </div>
          </header>
          <div className={styles.bio}>
            <h3>{`${userQueryData.user.first_name} ${userQueryData.user.last_name}`}</h3>
            <p>{userQueryData.user.bio}</p>
          </div>
          <div className={styles.posts}>
            {userQueryData.user.posts.map((post: any) => (
              <Link to={'/posts/' + post.id}>
                <PostPic userID={id} postID={post.id} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }
};
export default Profile;
