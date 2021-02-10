/* eslint-disable @typescript-eslint/no-explicit-any */
import Comment from '../../models/comment';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {createCommentRules, updateCommentRules} from '../../rules/commentRules';
import {ObjectId} from 'mongoose';

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

export async function updateComment(_parent: any, args: any, {headers}: any) {
  try {
    await updateCommentRules.validate(args);
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundComment = await Comment.findById(args.comment_id);
    if (!foundComment) {
      return new GraphQLError('Comment does not exist');
    }
    if (user.id !== foundComment.author.toString()) {
      return new GraphQLError("Cannot edit other user's comment");
    }
    return await Comment.findByIdAndUpdate(
      foundComment._id,
      {
        content: args.content,
      },
      {new: true}
    );
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function deleteComment(_parent: any, args: any, {headers}: any) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundComment = await Comment.findById(args.comment_id);
    if (!foundComment) {
      return new GraphQLError('Comment does not exist');
    }
    if (user.id !== foundComment.author.toString()) {
      return new GraphQLError("Cannot delete other user's comment");
    }
    return await Comment.findByIdAndDelete(foundComment._id);
  } catch (err) {
    return new GraphQLError(err);
  }
}
