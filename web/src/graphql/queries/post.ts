import {gql} from '@apollo/client';

export const query_post = gql`
  query Post($id: ID!) {
    post(id: $id) {
      caption
      location
      author {
        id
        username
      }
      likes {
        id
      }
    }
  }
`;
