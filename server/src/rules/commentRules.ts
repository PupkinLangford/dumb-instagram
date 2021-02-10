import * as yup from 'yup';
import Post from '../models/post';

export const createCommentRules = yup.object().shape({
  content: yup.string().required().min(1, 'comment may not be blank'),
  post_id: yup
    .string()
    .required()
    .test('parent post check', 'Post does not exist', async post_id => {
      const foundPost = await Post.findById(post_id);
      return !!foundPost;
    }),
});

export const updateCommentRules = yup.object().shape({
  content: yup.string().required().min(1, 'comment may not be blank'),
  comment_id: yup.string().required(),
});
