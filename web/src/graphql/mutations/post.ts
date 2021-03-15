import {gql} from '@apollo/client';

export const mutation_createPost = gql`
  mutation CreatePost($photo: Upload!, $caption: String, $location: String) {
    createPost(photo: $photo, caption: $caption, location: $location) {
      id
    }
  }
`;
