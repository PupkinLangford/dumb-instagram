import {gql} from '@apollo/client';

export const query_current_user = gql`
  query {
    current_user {
      id
      username
      first_name
      last_name
      email
      bio
    }
  }
`;

export const query_user = gql`
  query User($id: ID!, $current_user: ID!) {
    user(id: $id) {
      username
      first_name
      last_name
      bio
      posts {
        id
      }
      posts_count
      following_count
      followers_count
    }

    isFollowing(follower_id: $current_user, following_id: $id)
  }
`;

export const query_user_following = gql`
  query User($id: ID!) {
    user(id: $id) {
      following {
        following {
          id
          username
          first_name
          last_name
        }
      }
    }
  }
`;

export const query_user_followers = gql`
  query User($id: ID!) {
    user(id: $id) {
      followers {
        follower {
          id
          username
          first_name
          last_name
        }
      }
    }
  }
`;

export const query_search_users = gql`
  query SearchUsers($searchQuery: String!) {
    search_users(searchQuery: $searchQuery) {
      id
      username
      first_name
      last_name
    }
  }
`;
