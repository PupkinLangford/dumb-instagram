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
      following {
        following {
          id
        }
      }
      followers {
        follower {
          id
        }
      }
    }
  }
`;
