import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {jwtValidate} from '../middlewares/jwtValidate';
import {commentType, PostPreviewType, PostType, UserType} from './types';
import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';
import Follow from '../models/follow';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    current_user: {
      type: UserType,
      resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        const user = jwtValidate(authorization);
        return User.findById(user.id).populate([
          {
            path: 'posts',
            populate: 'likes comments comments_count last_comments likes_count',
          },
          {path: 'followers followers_count following_count posts_count'},
          {
            path: 'following',
            populate: {
              path: 'posts',
              populate:
                'likes comments comments_count last_comments likes_count',
            },
          },
        ]);
      },
    },
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return User.findById(args.id, '-password -email').populate(
          'posts followers following followers_count following_count posts_count'
        );
      },
    },
    search_users: {
      type: new GraphQLList(UserType),
      args: {searchQuery: {type: new GraphQLNonNull(GraphQLString)}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return User.find(
          {username: {$regex: args.searchQuery, $options: 'i'}},
          '-password -email'
        ).populate(
          'posts followers following followers_count following_count posts_count'
        );
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return User.find({}, '-password -email').populate(
          'posts followers following followers_count following_count posts_count'
        );
      },
    },
    post: {
      type: PostType,
      args: {id: {type: GraphQLID}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Post.findById(args.id).populate(
          'comments likes comments_count last_comments likes_count'
        );
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Post.find({})
          .populate('comments likes comments_count last_comments likes_count')
          .sort('-timestamp');
      },
    },
    explore_posts: {
      type: new GraphQLList(PostPreviewType),
      args: {count: {type: GraphQLInt}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Post.aggregate()
          .project({
            id: {$toString: '$_id'},
            author: 1,
          })
          .sample(args.count);
      },
    },
    comment: {
      type: commentType,
      args: {id: {type: GraphQLID}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Comment.findById(args.id);
      },
    },
    isFollowing: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {follower_id: {type: GraphQLID}, following_id: {type: GraphQLID}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Follow.exists({
          follower: args.follower_id,
          following: args.following_id,
        });
      },
    },
  },
});
