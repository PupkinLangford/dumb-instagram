import {createFollow, createPost, createUser} from './utils';
import request from 'supertest';
import app from '../index';
import {IUser} from '../models/user';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import {disconnectDb} from '../db';

const mutationFollow = (user_id: string) => `
mutation {
  followUser (user_id: "${user_id}") {
    following {
        username
        followers {
            follower {
                username
            }
        }
        following {
            following {
                username
            }
        }
    }
  }
}
`;

const mutationUnfollow = (user_id: string) => `
mutation {
  unfollowUser (user_id: "${user_id}") {
    following {
        username
        followers {
            follower {
                username
            }
        }
        following {
            following {
                username
            }
        }
    }
  }
}
`;

const queryIsFollowing = (follower_id: string, following_id: string) => `query {
  isFollowing(follower_id:"${follower_id}" following_id:"${following_id}")
}`;

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

test('can follow user exactly once', async () => {
  const post = await createPost();
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationFollow(post.author.toString()),
    });
  expect(res.body.errors).toBeUndefined();
  expect(res.body.data.followUser.following.username).toBe('testposter');
  expect(
    res.body.data.followUser.following.followers[0].follower.username
  ).toBe('testuser');
  expect(res.body.data.followUser.following.following.length).toBe(0);
  const res2 = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationFollow(post.author.toString()),
    });
  expect(res2.body.errors).not.toBeUndefined();
});

test('can only unfollow followed users', async () => {
  const post = await createPost();
  await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationFollow(post.author.toString()),
    });
  const res2 = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationUnfollow(post.author.toString()),
    });
  expect(res2.body.errors).toBeUndefined();
  expect(res2.body.data.unfollowUser.following.username).toBe('testposter');
  expect(res2.body.data.unfollowUser.following.followers.length).toBe(0);
  expect(res2.body.data.unfollowUser.following.following.length).toBe(0);
  const res3 = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationUnfollow(post.author.toString()),
    });
  expect(res3.body.errors).not.toBeUndefined();
});

test('isFollowing returns true correctly', async () => {
  const [F1] = await createFollow();
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: queryIsFollowing(F1.follower.toString(), F1.following.toString()),
    });
  expect(res.body.errors).toBeUndefined();
  expect(res.body.data.isFollowing).toBe(true);
});

test('isFollowing returns false correctly', async () => {
  const [F1] = await createFollow();
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: queryIsFollowing(F1.follower.toString(), user.id.toString()),
    });
  expect(res.body.errors).toBeUndefined();
  expect(res.body.data.isFollowing).toBe(false);
});

afterAll(() => {
  disconnectDb();
});

test('user cannot follow self', async () => {
  const res = await server
    .post('/graphql')
    .set('Content-type', 'application/json')
    .set('Authorization', token)
    .send({
      query: mutationFollow(user._id),
    });
  expect(res.body.errors).not.toBeUndefined();
});
