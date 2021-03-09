import {gql} from '@apollo/client';

export const mutation_signup = gql`
  mutation Signup(
    $email: String!
    $username: String!
    $password: String!
    $passwordConfirm: String!
  ) {
    signup(
      email: $email
      username: $username
      password: $password
      passwordConfirm: $passwordConfirm
    ) {
      username
    }
  }
`;

export const mutation_login = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        profile_pic
      }
    }
  }
`;

export const mutation_changeProfilePic = gql`
  mutation changeProfilePic($picture: Upload!) {
    changeProfilePic(picture: $picture) {
      profile_pic
    }
  }
`;

export const mutation_deleteProfilePic = gql`
  mutation deleteProfilePic {
    deleteProfilePic
  }
`;

export const mutation_editProfile = gql`
  mutation editProfile(
    $first_name: String!
    $last_name: String!
    $bio: String
    $email: String!
    $emailConfirm: String!
  ) {
    changeName(first_name: $first_name, last_name: $last_name) {
      first_name
      last_name
    }
    changeEmail(email: $email, emailConfirm: $emailConfirm) {
      email
    }
    changeBio(bio: $bio) {
      bio
    }
  }
`;
