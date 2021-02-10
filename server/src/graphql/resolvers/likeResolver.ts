/* eslint-disable @typescript-eslint/no-explicit-any */
import Like from '../../models/like';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {ObjectId} from 'mongoose';

export async function likePost(_parent: unknown, args: any, {headers}: any) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundLike = await Like.findOne({
      post: args.post_id,
      liker: (user.id as unknown) as ObjectId,
    });
    if (foundLike) {
      return new GraphQLError('Post already liked by user');
    } else {
      const like = new Like({liker: user.id, post: args.post_id});
      return await like.save();
    }
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function unlikePost(_parent: unknown, args: any, {headers}: any) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundLike = await Like.findOne({
      post: args.post_id,
      liker: (user.id as unknown) as ObjectId,
    });
    if (!foundLike) {
      return new GraphQLError('Post already liked by user');
    } else {
      return await Like.findByIdAndDelete(foundLike._id);
    }
  } catch (err) {
    return new GraphQLError(err);
  }
}
