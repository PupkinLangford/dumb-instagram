/* eslint-disable @typescript-eslint/no-explicit-any */
import Post from '../../models/post';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';

export async function createPost(_parent: unknown, args: any, {headers}: any) {
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
