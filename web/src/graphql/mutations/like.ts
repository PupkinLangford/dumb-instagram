import {gql} from '@apollo/client';

export const mutation_likePost = gql`
  mutation LikePost($post_id: ID!) {
    likePost(post_id: $post_id) {
      id
      likes_count
      isLiked
    }
  }
`;

export const mutation_unlikePost = gql`
  mutation UnlikePost($post_id: ID!) {
    unlikePost(post_id: $post_id) {
      id
      likes_count
      isLiked
    }
  }
`;
