import Comment from '../../models/comment';
import Post from '../../models/post';
import {GraphQLError} from 'graphql';
import {jwtValidate} from '../../middlewares/jwtValidate';
import {createCommentRules, updateCommentRules} from '../../rules/commentRules';
import {Request} from 'express';
import {ObjectId} from 'mongoose';

export async function createComment(
  _parent: unknown,
  args: {content?: string; post_id?: ObjectId},
  {headers}: Request
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
    await comment.save();
    return await Post.findById(args.post_id).populate(
      'comments likes comments_count last_comments likes_count'
    );
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function updateComment(
  _parent: unknown,
  args: {content?: string; comment_id?: ObjectId},
  {headers}: Request
) {
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

export async function deleteComment(
  _parent: unknown,
  args: {comment_id?: ObjectId},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const foundComment = await Comment.findById(args.comment_id);
    if (!foundComment) {
      return new GraphQLError('Comment does not exist');
    }
    if (user.id !== foundComment.author.toString()) {
      const parent_post = await Post.findById(foundComment.post);
      if (!parent_post) {
        return new GraphQLError('Parent post does not exist');
      }
      if (user.id !== parent_post.author.toString()) {
        return new GraphQLError("Cannot delete other user's comment");
      }
    }
    return await Comment.findByIdAndDelete(foundComment._id);
  } catch (err) {
    return new GraphQLError(err);
  }
}
