import Post from '../../models/post';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {Request} from 'express';
import {ObjectId} from 'mongoose';

export async function createPost(
  _parent: unknown,
  args: {photo?: string; caption?: string; location?: string},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const post = new Post({
      photo: args.photo,
      caption: args.caption,
      author: user.id,
      location: args.location,
    });
    return await post.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function updatePost(
  _parent: unknown,
  args: {post_id?: ObjectId; caption?: string; location?: string},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundPost = await Post.findById(args.post_id);
    if (!foundPost) {
      return new GraphQLError('Post does not exist');
    }
    if (user.id !== foundPost.author.toString()) {
      return new GraphQLError("Cannot edit other user's post");
    } else {
      return Post.findByIdAndUpdate(
        foundPost._id,
        {
          caption: args.caption || foundPost.caption,
          location: args.location || foundPost.location,
        },
        {new: true}
      );
    }
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function deletePost(
  _parent: unknown,
  args: {post_id?: ObjectId},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundPost = await Post.findById(args.post_id);
    if (!foundPost) {
      return new GraphQLError('Post does not exist');
    }
    if (user.id !== foundPost.author.toString()) {
      return new GraphQLError("Cannot delete other user's post");
    }
    return await foundPost.deleteOne();
  } catch (err) {
    return new GraphQLError(err);
  }
}
