import Follow from '../../models/follow';
import User from '../../models/user';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {ObjectId} from 'mongoose';
import {Request} from 'express';

export async function followUser(
  _parent: unknown,
  args: {user_id?: ObjectId},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    if (user.id === args.user_id!.toString()) {
      return new GraphQLError('User cannot follow self');
    }
    const foundUser = await User.findById(args.user_id, '-password -email');
    if (!foundUser) {
      return new GraphQLError('User not found');
    }
    const foundFollow = await Follow.findOne({
      follower: (user.id as unknown) as ObjectId,
      following: args.user_id,
    });
    if (foundFollow) {
      return new GraphQLError('Already following this user');
    } else {
      const follow = new Follow({follower: user.id, following: args.user_id});
      await follow.save();
      return foundUser.populate(
        'posts followers following followers_count following_count posts_count'
      );
    }
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function unfollowUser(
  _parent: unknown,
  args: {user_id?: ObjectId},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundUser = await User.findById(args.user_id, '-password -email');
    if (!foundUser) {
      return new GraphQLError('User not found');
    }
    const foundFollow = await Follow.findOne({
      follower: (user.id as unknown) as ObjectId,
      following: args.user_id,
    });
    if (!foundFollow) {
      return new GraphQLError('Not following this user');
    } else {
      await foundFollow.deleteOne();
      return foundUser.populate(
        'posts followers following followers_count following_count posts_count'
      );
    }
  } catch (err) {
    return new GraphQLError(err);
  }
}
