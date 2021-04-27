import {gql} from '@apollo/client';

export const mutation_followUser = gql`
  mutation FollowUser($user_id: ID!) {
    followUser(user_id: $user_id) {
      id
      isFollowing
    }
  }
`;

export const mutation_unfollowUser = gql`
  mutation UnfollowUser($user_id: ID!) {
    unfollowUser(user_id: $user_id) {
      id
      isFollowing
    }
  }
`;
