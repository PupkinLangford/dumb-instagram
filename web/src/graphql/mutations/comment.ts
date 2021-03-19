import {gql} from '@apollo/client';

export const mutation_createComment = gql`
  mutation CreateComment($content: String!, $post_id: ID!) {
    createComment(content: $content, post_id: $post_id) {
      id
    }
  }
`;
