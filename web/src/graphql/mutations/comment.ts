import {gql} from '@apollo/client';

export const mutation_createComment = gql`
  mutation CreateComment($content: String!, $post_id: ID!) {
    createComment(content: $content, post_id: $post_id) {
      id
    }
  }
`;

export const mutation_deleteComment = gql`
  mutation deleteComment($comment_id: ID!) {
    deleteComment(comment_id: $comment_id) {
      id
    }
  }
`;
