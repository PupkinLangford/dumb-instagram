import {GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType} from 'graphql';
import {jwtValidate} from '../middlewares/jwtValidate';
import {commentType, PostType, UserType} from './types';
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
        return User.findById(user.id).populate('posts followers following');
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
    feed_posts: {
      type: new GraphQLList(PostType),
      async resolve(_parent, _args, {headers}) {
        const {authorization} = headers;
        const user = jwtValidate(authorization);
        const follows = await Follow.find({
          follower: user.id as Object,
        });
        const following = follows.map(f => f.following);
        return Post.find({author: following as Object})
          .populate('comments likes')
          .sort('-timestamp');
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
