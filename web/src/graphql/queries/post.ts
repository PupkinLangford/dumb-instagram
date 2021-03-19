import {gql} from '@apollo/client';

export const query_post = gql`
  query Post($id: ID!) {
    post(id: $id) {
      caption
      location
      format_date
      author {
        id
        username
      }
      likes {
        id
        liker {
          id
        }
      }
      comments {
        author {
          id
          username
        }
        content
        format_date
      }
    }
  }
`;
