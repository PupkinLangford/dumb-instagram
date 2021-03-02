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
