import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {GraphQLDateTime} from 'graphql-iso-date';
import User from '../models/user';
import Post from '../models/post';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    first_name: {type: new GraphQLNonNull(GraphQLString)},
    last_name: {type: new GraphQLNonNull(GraphQLString)},
    username: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    profile_pic: {type: new GraphQLNonNull(GraphQLString)},
    bio: {type: GraphQLString},
    full_name: {type: new GraphQLNonNull(GraphQLString)},
    posts: {type: new GraphQLList(PostType)},
  }),
});

export const PostType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    photo: {type: new GraphQLNonNull(GraphQLString)},
    caption: {type: GraphQLString},
    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent) {
        return User.findById(parent.author);
      },
    },
    location: {type: GraphQLString},
    timestamp: {type: GraphQLDateTime},
    format_date: {type: GraphQLString},
    comments: {
      type: new GraphQLList(commentType),
    },
    likes: {type: new GraphQLList(likeType)},
  }),
});

export const commentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent) {
        return User.findById(parent.author);
      },
    },
    content: {type: new GraphQLNonNull(GraphQLString)},
    post: {
      type: new GraphQLNonNull(PostType),
      resolve(parent) {
        return Post.findById(parent.post);
      },
    },
    timestamp: {type: new GraphQLNonNull(GraphQLDateTime)},
    format_date: {type: GraphQLString},
  }),
});

export const likeType = new GraphQLObjectType({
  name: 'Like',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    liker: {
      type: new GraphQLNonNull(UserType),
      resolve(parent) {
        return User.findById(parent.liker);
      },
    },
    post: {
      type: new GraphQLNonNull(PostType),
      resolve(parent) {
        return Post.findById(parent.post);
      },
    },
    timestamp: {type: new GraphQLNonNull(GraphQLDateTime)},
    format_date: {type: GraphQLString},
  }),
});

export const tokenType = new GraphQLObjectType({
  name: 'token',
  fields: () => ({
    token: {type: GraphQLString},
    user: {type: UserType},
  }),
});