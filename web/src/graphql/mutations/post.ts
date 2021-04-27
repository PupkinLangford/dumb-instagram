import {gql} from '@apollo/client';

export const mutation_createPost = gql`
  mutation CreatePost($photo: Upload!, $caption: String, $location: String) {
    createPost(photo: $photo, caption: $caption, location: $location) {
      id
    }
  }
`;

export const mutation_updatePost = gql`
  mutation updatePost($post_id: ID!, $caption: String, $location: String) {
    updatePost(post_id: $post_id, caption: $caption, location: $location) {
      id
      caption
      location
    }
  }
`;

export const mutation_deletePost = gql`
  mutation deletePost($post_id: ID!) {
    deletePost(post_id: $post_id) {
      id
    }
  }
`;
