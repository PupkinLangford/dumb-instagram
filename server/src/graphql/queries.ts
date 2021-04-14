import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {jwtValidate} from '../middlewares/jwtValidate';
import {commentType, PostType, UserType} from './types';
import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    current_user: {
      type: UserType,
      resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        const user = jwtValidate(authorization);
        return User.findById(user.id).populate([
          {path: 'posts', populate: 'likes comments'},
          {path: 'followers'},
          {
            path: 'following',
            populate: {path: 'posts', populate: 'likes comments'},
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
          'posts followers following'
        );
      },
    },
    search_users: {
      type: new GraphQLList(UserType),
      args: {searchQuery: {type: new GraphQLNonNull(GraphQLString)}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return User.find({username: {$regex: args.searchQuery, $options: 'i'}});
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return User.find({}, '-password -email').populate(
          'posts followers following'
        );
      },
    },
    post: {
      type: PostType,
      args: {id: {type: GraphQLID}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Post.findById(args.id).populate('comments likes');
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Post.find({}).populate('comments likes').sort('-timestamp');
      },
    },
    explore_posts: {
      type: new GraphQLList(PostType),
      args: {count: {type: GraphQLInt}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return Post.aggregate()
          .project({
            id: {$toString: '$_id'},
            caption: 1,
            location: 1,
            timestamp: 1,
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
  },
});
