import {gql} from '@apollo/client';

export const query_current_user = gql`
  query {
    current_user {
      id
      username
    }
  }
`;
