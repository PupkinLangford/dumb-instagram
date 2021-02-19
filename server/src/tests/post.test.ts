import {createPost, createComment, createLike} from './utils';
import request from 'supertest';
import app from '../index';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import {disconnectDb} from '../db';
import {IPost} from '../models/post';
import Post from '../models/post';
import Comment from '../models/comment';
import Like from '../models/like';

const queryPost = (post_id: string) => `
query {
    post(id: "${post_id}") {
        caption
    }
}
`;

const queryPosts = () => `
query {
    posts {
        caption
    }
}
`;

const mutationCreatePost = (
  photo: string,
  caption: string,
  location: string
) => `
      mutation {
        createPost(
          photo: "${photo}", 
          caption: "${caption}",
          location: "${location}"
          ) 
        {
          photo
          caption
          location
          author {
              id
          }
        }
      }`;

/*const mutationCreatePost = `mutation createPost($photo: Upload!) {
  createPost(photo: $photo, caption: "Post with photo", location: "Asia, Lima Peru") {
    photo
    id
  caption
  location
  }
}
`;*/

const mutationUpdatePost = (
  post_id: string,
  caption: string,
  location: string
) => `
        mutation {
            updatePost(
            post_id: "${post_id}", 
            caption: "${caption}",
            location: "${location}"
            ) 
            {
            caption
            location
            }
        }`;

const mutationDeletePost = (post_id: string) => `
        mutation {
            deletePost(post_id: "${post_id}") {
                id
            }
        }`;

describe('post queries', () => {
  let server: request.SuperTest<request.Test>;
  let post: IPost;
  let token: string;
  beforeAll(async () => {
    server = request(app);
    post = await createPost();
    token = jsonwebtoken.sign({id: post.author}, config.jwtSecret!, {
      expiresIn: '1d',
    });
  });

  test('Can query post by id', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: queryPost(post._id),
      });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.post.caption).toBe('test post');
  });

  test('Can query all posts', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: queryPosts(),
      });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.posts.length).toBeGreaterThan(0);
    expect(res.body.data.posts[0].caption).toBe('test post');
  });
});

describe('post mutations', () => {
  let server: request.SuperTest<request.Test>;
  let post: IPost;
  let token: string;
  beforeAll(async () => {
    server = request(app);
    post = await createPost();
    token = jsonwebtoken.sign({id: post.author}, config.jwtSecret!, {
      expiresIn: '1d',
    });
  });

  test('can create post with proper args', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: mutationCreatePost('photo', 'test content', 'Lima, PE'),
      });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createPost.photo).toBe('photo');
    expect(res.body.data.createPost.caption).toBe('test content');
    expect(res.body.data.createPost.location).toBe('Lima, PE');
    expect(res.body.data.createPost.author.id).toEqual(post.author.toString());
  });

  test('create post fails without authorization', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'faketoken')
      .send({
        query: mutationCreatePost('photo', 'test content', 'Lima, PE'),
      });
    expect(res.body.errors).not.toBeUndefined();
  });

  test('update post successful with valid args and authorization', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: mutationUpdatePost(
          post._id.toString(),
          'update test',
          'Chiclayo, PE'
        ),
      });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.updatePost.caption).toBe('update test');
    expect(res.body.data.updatePost.location).toBe('Chiclayo, PE');
  });

  test('update post fails with other user token', async () => {
    const post2 = await createPost();
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: mutationUpdatePost(
          post2._id.toString(),
          'update test',
          'Chiclayo, PE'
        ),
      });
    expect(res.body.errors).not.toBeUndefined();
  });

  test('delete post fails with other user token', async () => {
    const post2 = await createPost();
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: mutationDeletePost(post2._id.toString()),
      });
    expect(res.body.errors).not.toBeUndefined();
  });

  test('delete post successful and removes lingering comments', async () => {
    const comment = await createComment();
    const post2 = await Post.findById(comment.post);
    const newtoken = jsonwebtoken.sign({id: post2!.author}, config.jwtSecret!, {
      expiresIn: '1d',
    });
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', newtoken)
      .send({
        query: mutationDeletePost(comment.post.toString()),
      });
    expect(res.body.errors).toBeUndefined();
    const comments = await Comment.find({});
    expect(comments.length).toBe(0);
    const deletedPost = await Post.findById(comment.post);
    expect(deletedPost).toBeNull();
  });

  test('delete post removes lingering likes', async () => {
    const like = await createLike();
    const post2 = await Post.findById(like.post);
    const newtoken = jsonwebtoken.sign({id: post2!.author}, config.jwtSecret!, {
      expiresIn: '1d',
    });
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', newtoken)
      .send({
        query: mutationDeletePost(like.post.toString()),
      });
    expect(res.body.errors).toBeUndefined();
    const likes = await Like.find({});
    expect(likes.length).toBe(0);
  });
});

afterAll(() => {
  disconnectDb();
});
