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
          username
          first_name
          last_name
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
