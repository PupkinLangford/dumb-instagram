import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/use_auth';
import styles from './Profile.module.css';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import ProfilePic from '../components/ProfilePic';
import {
  query_user,
  query_user_followers,
  query_user_following,
} from '../graphql/queries/user';
import PostPic from '../components/PostPic';
import {
  mutation_followUser,
  mutation_unfollowUser,
} from '../graphql/mutations/follow';
import UsersModal from '../components/UsersModal';
import CustomLoader from '../components/CustomLoader';
import {getCurrentUser} from '../utils';

const Profile = () => {
  const [auth, loadingAuth] = useAuth();
  const {id} = useParams<{id: string}>();
  const history = useHistory();
  const [followUser] = useMutation(mutation_followUser);
  const [unfollowUser] = useMutation(mutation_unfollowUser);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const {loading: userQueryLoading, data: userQueryData} = useQuery(
    query_user,
    {variables: {id, current_user: getCurrentUser()}}
  );

  const [
    getFollowing,
    {loading: followingLoading, data: followingData},
  ] = useLazyQuery(query_user_following);

  const [
    getFollowers,
    {loading: followersLoading, data: followersData},
  ] = useLazyQuery(query_user_followers);

  useEffect(() => {
    if (!userQueryLoading) console.log(userQueryData);
  });
  if (!loadingAuth && !auth) {
    history.push('/login');
  }

  if (userQueryLoading) {
    return <CustomLoader />;
  }
  if (!userQueryLoading && (!userQueryData || !userQueryData.user)) {
    history.push('/');
    return null;
  }

  const submitFollow = async () => {
    if (userQueryData.isFollowing) {
      return;
    }
    await followUser({variables: {user_id: id}});
    history.go(0);
  };

  const submitUnfollow = async () => {
    if (!userQueryData.isFollowing) {
      return;
    }
    await unfollowUser({variables: {user_id: id}});
    history.go(0);
  };

  const followButton = userQueryData.isFollowing ? (
    <button type="button" onClick={() => submitUnfollow()} id={styles.unfollow}>
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
            {id === getCurrentUser() ? (
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
        <div className={styles.stats}>
          <div>
            <span className={styles.statCount}>
              {userQueryData.user.posts_count}
            </span>
            <span className={styles.statName}>posts</span>
          </div>
          <div
            onClick={() => {
              setShowFollowersModal(true);
              getFollowers({variables: {id}});
            }}
          >
            <span className={styles.statCount}>
              {userQueryData.user.followers_count}
            </span>
            <span className={styles.statName}>followers</span>
          </div>
          <div
            onClick={() => {
              setShowFollowingModal(true);
              getFollowing({variables: {id}});
            }}
          >
            <span className={styles.statCount}>
              {userQueryData.user.following_count}
            </span>
            <span className={styles.statName}>following</span>
          </div>
        </div>
        <div className={styles.posts}>
          {userQueryData.user.posts.map((post: any) => (
            <Link to={'/posts/' + post.id} key={post.id}>
              <PostPic userID={id} postID={post.id} />
            </Link>
          ))}
        </div>
      </main>
      {(showFollowersModal || showFollowingModal) &&
      (followersLoading || followingLoading) ? (
        <CustomLoader />
      ) : null}
      {showFollowersModal && followersData ? (
        <UsersModal
          closeModal={() => setShowFollowersModal(false)}
          title="Followers"
          userList={followersData.user.followers.map((f: any) => f.follower)}
        />
      ) : null}
      {showFollowingModal && followingData ? (
        <UsersModal
          closeModal={() => setShowFollowingModal(false)}
          title="Following"
          userList={followingData.user.following.map((f: any) => f.following)}
        />
      ) : null}
    </div>
  );
};
export default Profile;
