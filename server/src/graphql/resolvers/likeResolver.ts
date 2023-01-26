import Like from '../../models/like';
import Post from '../../models/post';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {ObjectId} from 'mongoose';
import {Request} from 'express';

export async function likePost(
  _parent: unknown,
  args: {post_id?: ObjectId},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundLike = await Like.findOne({
      post: args.post_id,
      liker: user.id as unknown as ObjectId,
    });
    if (foundLike) {
      return new GraphQLError('Post already liked by user');
    } else {
      const like = new Like({liker: user.id, post: args.post_id});
      await like.save();
      return await Post.findById(args.post_id).populate(
        'comments likes comments_count last_comments likes_count'
      );
    }
  } catch (err) {
    return new GraphQLError(err as string);
  }
}

export async function unlikePost(
  _parent: unknown,
  args: {post_id?: ObjectId},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundLike = await Like.findOne({
      post: args.post_id,
      liker: user.id as unknown as ObjectId,
    });
    if (!foundLike) {
      return new GraphQLError('Post already liked by user');
    } else {
      await Like.findByIdAndDelete(foundLike._id);
      return await Post.findById(args.post_id).populate(
        'comments likes comments_count last_comments likes_count'
      );
    }
  } catch (err) {
    return new GraphQLError(err as string);
  }
}
