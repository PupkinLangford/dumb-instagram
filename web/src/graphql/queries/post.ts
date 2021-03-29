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

export const query_explore_post = gql`
  query ExplorePost($count: Int!) {
    explore_posts(count: $count) {
      id
      author {
        id
      }
    }
  }
`;

export const query_following_posts = gql`
  query {
    current_user {
      following {
        following {
          id
          username
          posts {
            id
            caption
            timestamp
            format_date
          }
        }
      }
    }
  }
`;
