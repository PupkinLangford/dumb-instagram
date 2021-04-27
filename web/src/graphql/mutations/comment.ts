import {gql} from '@apollo/client';

export const mutation_createComment = gql`
  mutation CreateComment($content: String!, $post_id: ID!) {
    createComment(content: $content, post_id: $post_id) {
      id
      comments_count
      last_comments {
        content
        author {
          id
          username
        }
      }
      comments {
        id
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

export const mutation_deleteComment = gql`
  mutation deleteComment($comment_id: ID!) {
    deleteComment(comment_id: $comment_id) {
      id
    }
  }
`;
