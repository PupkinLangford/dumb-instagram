/* eslint-disable @typescript-eslint/no-explicit-any */
import Comment from '../../models/comment';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {createCommentRules} from '../../rules/commentRules';

export async function createComment(
  _parent: unknown,
  args: any,
  {headers}: any
) {
  try {
    await createCommentRules.validate(args);
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const comment = new Comment({
      author: user.id,
      content: args.content,
      post: args.post_id,
    });
    return await comment.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}
