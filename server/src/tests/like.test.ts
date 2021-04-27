import {createPost, createUser} from './utils';
import request from 'supertest';
import app from '../index';
import {IUser} from '../models/user';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import {disconnectDb} from '../db';

const mutationLike = (post_id: string) => `
mutation {
  likePost (post_id: "${post_id}") {
    isLiked
  }
}
`;

const mutationUnlike = (post_id: string) => `
mutation {
  unlikePost (post_id: "${post_id}") {
    isLiked
  }
}
`;

let server: request.SuperTest<request.Test>;
let user: IUser;
let token: string;
beforeAll(async () => {
  server = request(app);
  user = await createUser();
  token = jsonwebtoken.sign({id: user.id}, config.jwtSecret!, {
    expiresIn: '1d',
  });
});

test('can like post exactly once', async () => {
  const post = await createPost();
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationLike(post._id),
    });
  expect(res.body.errors).toBeUndefined();
  expect(res.body.data.likePost.isLiked).toBe(true);
  const res2 = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationLike(post._id),
    });
  expect(res2.body.errors).not.toBeUndefined();
});

test('can only unlike liked posts', async () => {
  const post = await createPost();
  await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationLike(post._id),
    });
  const res2 = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationUnlike(post._id),
    });
  expect(res2.body.errors).toBeUndefined();
  expect(res2.body.data.unlikePost.isLiked).toBe(false);
  const res3 = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationUnlike(post._id),
    });
  expect(res3.body.errors).not.toBeUndefined();
});

afterAll(() => {
  disconnectDb();
});
