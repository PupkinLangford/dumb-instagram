import Post from '../../models/post';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {Request} from 'express';
import {ObjectId} from 'mongoose';
import {FileUpload} from 'graphql-upload';
import {deleteImage, uploadImage} from './imageFunctions';

export async function createPost(
  _parent: unknown,
  args: {photo?: FileUpload; caption?: string; location?: string},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const post = new Post({
      caption: args.caption,
      author: user.id,
      location: args.location,
    });
    const url = await uploadImage(args.photo!, user.id, post._id);
    if (url === '') {
      return new GraphQLError('Upload failed');
    }
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
          caption: args.caption || '',
          location: args.location || '',
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
    deleteImage(user.id + '/' + args.post_id);
    return await foundPost.deleteOne();
  } catch (err) {
    return new GraphQLError(err);
  }
}
