import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import User from '../models/user';
import Post from '../models/post';
import Like from '../models/like';
import Follow from '../models/follow';
import {jwtValidate} from '../middlewares/jwtValidate';
import {ObjectId} from 'mongoose';
import {DateTimeResolver} from 'graphql-scalars';

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
    bio: {type: GraphQLString},
    full_name: {type: new GraphQLNonNull(GraphQLString)},
    posts: {type: new GraphQLList(PostType)},
    posts_count: {type: new GraphQLNonNull(GraphQLInt)},
    following: {type: new GraphQLList(followType)},
    following_count: {type: new GraphQLNonNull(GraphQLInt)},
    followers: {type: new GraphQLList(followType)},
    followers_count: {type: new GraphQLNonNull(GraphQLInt)},
    isFollowing: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve(parent, _args, context) {
        return Follow.exists({
          following: parent.id,
          follower: jwtValidate(context.headers.authorization)
            .id as unknown as ObjectId,
        });
      },
    },
  }),
});

export const PostType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    caption: {type: GraphQLString},
    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent) {
        return User.findById(parent.author, '-password -email');
      },
    },
    location: {type: GraphQLString},
    timestamp: {type: DateTimeResolver},
    format_date: {type: GraphQLString},
    comments: {
      type: new GraphQLList(commentType),
    },
    comments_count: {type: new GraphQLNonNull(GraphQLInt)},
    last_comments: {type: new GraphQLList(commentType)},
    likes: {type: new GraphQLList(likeType)},
    likes_count: {type: new GraphQLNonNull(GraphQLInt)},
    isLiked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve(parent, _args, context) {
        return Like.exists({
          post: parent.id,
          liker: jwtValidate(context.headers.authorization)
            .id as unknown as ObjectId,
        });
      },
    },
  }),
});

export const commentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent) {
        return User.findById(parent.author, '-password -email');
      },
    },
    content: {type: new GraphQLNonNull(GraphQLString)},
    post: {
      type: new GraphQLNonNull(PostType),
      resolve(parent) {
        return Post.findById(parent.post).populate(
          'comments likes comments_count last_comments likes_count'
        );
      },
    },
    timestamp: {type: new GraphQLNonNull(DateTimeResolver)},
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
        return User.findById(parent.liker, '-password -email');
      },
    },
    post: {
      type: new GraphQLNonNull(PostType),
      resolve(parent) {
        return Post.findById(parent.post).populate(
          'comments likes comments_count last_comments likes_count'
        );
      },
    },
    timestamp: {type: new GraphQLNonNull(DateTimeResolver)},
    format_date: {type: GraphQLString},
  }),
});

export const followType = new GraphQLObjectType({
  name: 'Follow',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    follower: {
      type: new GraphQLNonNull(UserType),
      resolve(parent) {
        return User.findById(parent.follower, '-password -email').populate(
          'posts followers following'
        );
      },
    },
    following: {
      type: new GraphQLNonNull(UserType),
      resolve(parent) {
        return User.findById(parent.following, '-password -email').populate(
          'posts followers following'
        );
      },
    },
    posts: {
      type: new GraphQLList(PostType),
    },
    timestamp: {type: new GraphQLNonNull(DateTimeResolver)},
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

export const PostPreviewType = new GraphQLObjectType({
  name: 'PostPreview',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    author: {type: new GraphQLNonNull(GraphQLID)},
  }),
});
