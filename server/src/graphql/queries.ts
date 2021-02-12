import {GraphQLID, GraphQLList, GraphQLObjectType} from 'graphql';
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
        return User.findById(user.id).populate('posts');
      },
    },
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve(_parent, args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return User.findById(args.id, '-password -email').populate('posts');
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        jwtValidate(authorization);
        return User.find({}, '-password -email').populate('posts');
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
