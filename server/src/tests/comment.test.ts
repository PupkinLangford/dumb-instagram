import {createComment, createPost} from './utils';
import request from 'supertest';
import app from '../index';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import {disconnectDb} from '../db';
import {IComment} from '../models/comment';
import {Types} from 'mongoose';
import Comment from '../models/comment';
import Post from '../models/post';

const queryComment = (comment_id: string) => `
query {
    comment(id: "${comment_id}") {
        content
    }
}
`;

const mutationCreateComment = (post_id: string, content: string) => `
          mutation {
              createComment(
              post_id: "${post_id}", 
              content: "${content}"
              ) 
              {
                comments_count
                last_comments {
                  content
                }
              }
          }`;

const mutationUpdateComment = (comment_id: string, content: string) => `
          mutation {
              updateComment(
              comment_id: "${comment_id}", 
              content: "${content}"
              ) 
              {
              content
              }
          }`;

const mutationDeleteComment = (comment_id: string) => `
          mutation {
              deleteComment(
              comment_id: "${comment_id}"
              ) 
              {
              content
              }
          }`;

let server: request.SuperTest<request.Test>;
let comment: IComment;
let token: string;
beforeAll(async () => {
  server = request(app);
  comment = await createComment();
  token = jsonwebtoken.sign({id: comment.author}, config.jwtSecret!, {
    expiresIn: '1d',
  });
});

test('can query comment by id', async () => {
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: queryComment(comment._id),
    });
  expect(res.body.errors).toBeUndefined();
  expect(res.body.data.comment.content).toBe('test comment');
});

test('create comment successful with valid args', async () => {
  const post = await createPost();
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationCreateComment(post._id, 'test comment text'),
    });
  expect(res.body.errors).toBeUndefined();
  expect(res.body.data.createComment.last_comments[0].content).toBe(
    'test comment text'
  );
  expect(res.body.data.createComment.comments_count).toBe(1);
});

test('create comment fails with invalid post id', async () => {
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationCreateComment(
        new Types.ObjectId().toString(),
        'test comment text'
      ),
    });
  expect(res.body.errors).not.toBeUndefined();
});

test('update comment successful with valid args and auth', async () => {
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationUpdateComment(comment._id, 'updating comment'),
    });
  expect(res.body.errors).toBeUndefined();
  expect(res.body.data.updateComment.content).toBe('updating comment');
});

test('update comment fails with invalid token', async () => {
  const nextComment = await createComment();
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationUpdateComment(nextComment._id, 'updating comment'),
    });
  expect(res.body.errors).not.toBeUndefined();
});

test('successfully delete comment', async () => {
  const nextComment = await createComment();
  const newtoken = jsonwebtoken.sign(
    {id: nextComment.author.toString()},
    config.jwtSecret!,
    {
      expiresIn: '1d',
    }
  );
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', newtoken)
    .send({
      query: mutationDeleteComment(nextComment._id),
    });
  expect(res.body.errors).toBeUndefined();
  const foundComment = await Comment.findById(nextComment._id);
  expect(foundComment).toBeNull();
});

test('delete comment fails with improper auth', async () => {
  const nextComment = await createComment();
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationDeleteComment(nextComment._id),
    });
  expect(res.body.errors).not.toBeUndefined();
});

test('successfully delete comment by other user on own post', async () => {
  const nextComment = await createComment();
  const parent_post = await Post.findById(nextComment.post);
  const newtoken = jsonwebtoken.sign(
    {id: parent_post!.author.toString()},
    config.jwtSecret!,
    {
      expiresIn: '1d',
    }
  );
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', newtoken)
    .send({
      query: mutationDeleteComment(nextComment._id),
    });
  expect(res.body.errors).toBeUndefined();
  const foundComment = await Comment.findById(nextComment._id);
  expect(foundComment).toBeNull();
});

afterAll(() => {
  disconnectDb();
});
