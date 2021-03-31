import {gql} from '@apollo/client';

export const query_post = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      caption
      location
      format_date
      author {
        id
        username
      }
      likes {
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

export const query_feed_posts = gql`
  query {
    feed_posts {
      id
      caption
      location
      format_date
      author {
        id
        username
      }
      likes {
        liker {
          id
          username
          first_name
          last_name
        }
      }
    }
  }
`;
