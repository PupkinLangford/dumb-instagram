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
  query User($id: ID!) {
    user(id: $id) {
      username
      first_name
      last_name
      bio
      posts {
        id
        comments {
          id
        }
        likes {
          id
        }
      }
      posts_count
      following {
        following {
          id
          username
          first_name
          last_name
        }
      }
      following_count
      followers {
        follower {
          id
          username
          first_name
          last_name
        }
      }
      followers_count
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
