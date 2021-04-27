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
      isLiked
      likes_count
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

export const query_explore_post = gql`
  query ExplorePost($count: Int!) {
    explore_posts(count: $count) {
      id
      author
    }
  }
`;

export const query_feed_posts = gql`
  query {
    current_user {
      posts {
        id
        caption
        location
        format_date
        timestamp
        author {
          id
          username
        }
        likes_count
        comments_count
        last_comments {
          content
          author {
            id
            username
          }
        }
        isLiked
      }
      following {
        posts {
          id
          caption
          location
          format_date
          timestamp
          author {
            id
            username
          }
          likes_count
          comments_count
          last_comments {
            content
            author {
              id
              username
            }
          }
          isLiked
        }
      }
    }
  }
`;

export const query_post_likes = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
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
