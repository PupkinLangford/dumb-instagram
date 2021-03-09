import {createLike, createPost, createUser} from './utils';
import request from 'supertest';
import app from '../index';
import {IUser} from '../models/user';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import {disconnectDb} from '../db';
import bcrypt from 'bcrypt';
import {createComment} from './utils';
import Comment from '../models/comment';
import Like from '../models/like';
import Post from '../models/post';
import * as imageFunctions from '../graphql/resolvers/imageFunctions';
import path from 'path';

const queryCurrentUser = () => `
query {
    current_user {
        username
    }
}
`;

const queryUser = (user_id: string) => `
query {
    user(id: "${user_id}") {
        username
    }
}
`;

const queryUsers = () => `
query {
    users {
        id
    }
}
`;

const mutationSignup = (
  username: string,
  password: string,
  passwordConfirm: string,
  email: string
) => `
    mutation {
      signup(
        username: "${username}", 
        password: "${password}",
        passwordConfirm: "${passwordConfirm}",
        email: "${email}"
        ) 
      {
        username
        id
      }
    }`;

const mutationLogin = (username: string, password: string) => `
    mutation {
      login (username: "${username}", password: "${password}") 
      {
        token
        user {
          username
        }
      }
    }`;

const mutationChangeName = (first_name: string, last_name: string) => `
mutation {
  changeName (first_name: "${first_name}", last_name: "${last_name}") 
  {
      first_name
      last_name
  }
}`;

const mutationChangeEmail = (email: string, emailConfirm: string) => `
mutation {
  changeEmail (email: "${email}", emailConfirm: "${emailConfirm}") 
  {
      email
  }
}`;

const mutationChangeBio = (bio: string) => `
mutation {
  changeBio (bio: "${bio}") 
  {
      bio
  }
}`;

const mutationChangePassword = (password: string, passwordConfirm: string) => `
mutation {
  changePassword (password: "${password}", passwordConfirm: "${passwordConfirm}") 
  {
      password
  }
}`;

const _mutationChangeProfilePic = () => {
  return {
    query: `mutation changeProfilePic($picture: Upload!){
  changeProfilePic(picture: $picture) {
    username
  	profile_pic
  }
}`,
    variables: {picture: null},
  };
};

const mutationDeleteSelf = () => `
mutation {
    deleteSelf {
        id
    }
}`;

describe('user queries', () => {
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

  test('current user query returns current user', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: queryCurrentUser(),
      });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.current_user.username).toBe('testuser');
  });

  test('can query user by id', async () => {
    const post = await createPost();
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: queryUser(post.author.toString()),
      });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.user.username).toBe('testposter');
  });

  test('can query all users', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: queryUsers(),
      });
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.users.length).toBeGreaterThan(0);
  });
});

describe('signup and login', () => {
  let server: request.SuperTest<request.Test>;
  beforeAll(async () => {
    server = request(app);
    await createUser();
  });

  test('signup successful with valid args', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: mutationSignup('ruperttest', '12345', '12345', 'rupe@aol.com'),
      });
    expect(res.body.data.signup.username).toBe('ruperttest');
    expect(res.body.data.signup.id).not.toBeNull();
    expect(res.body.errors).toBeUndefined();
  });
  test('signup fails for existing username', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: mutationSignup('testuser', '12345', '12345', 'rupe@aol.com'),
      });
    expect(res.body.errors).not.toBeUndefined();
  });
  test('signup fails for password mismatch', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: mutationSignup('mark', '123456', '12345', 'rupe@aol.com'),
      });
    expect(res.body.errors).not.toBeUndefined();
  });
  test('login successful with valid parameters', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({query: mutationLogin('testuser', '12345')});
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.login.token.length).toBeGreaterThan(0);
    expect(res.body.data.login.user.username).toBe('testuser');
  });
  test('login fails with wrong username', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({query: mutationLogin('testuse', '12345')});
    expect(res.body.errors).not.toBeUndefined();
  });
  test('login fails with wrong password', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({query: mutationLogin('testuser', '123456')});
    expect(res.body.errors).not.toBeUndefined();
  });
});

describe('user mutations', () => {
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
  test('change name successful', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({query: mutationChangeName('Rupert', 'Pupkin')});
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.changeName.first_name).toBe('Rupert');
    expect(res.body.data.changeName.last_name).toBe('Pupkin');
  });

  test('change name fails with wrong token', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'fakewrongtoken2334523452345164')
      .send({query: mutationChangeName('Rupert', 'Pupkin')});
    expect(res.body.errors).not.toBeUndefined();
  });

  test('change email successful', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({query: mutationChangeEmail('wilford@aol.com', 'wilford@aol.com')});
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.changeEmail.email).toBe('wilford@aol.com');
  });

  test('change email fails for mismatch', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: mutationChangeEmail('wilford@aol.com', 'wwilford@aol.com'),
      });
    expect(res.body.errors).not.toBeUndefined();
  });

  test('change email fails with wrong token', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'fakewrongtoken2334523452345164')
      .send({query: mutationChangeEmail('wilford@aol.com', 'wilford@aol.com')});
    expect(res.body.errors).not.toBeUndefined();
  });

  test('change bio successful', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({query: mutationChangeBio('updated bio')});
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.changeBio.bio).toBe('updated bio');
  });

  test('change bio fails with wrong token', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'faketoken1234')
      .send({query: mutationChangeBio('updated bio')});
    expect(res.body.errors).not.toBeUndefined();
  });

  test('change profile pic successful', async () => {
    const uploadSpy = jest.spyOn(imageFunctions, 'uploadImage');
    uploadSpy.mockReturnValue(Promise.resolve('new url'));
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .field('operations', JSON.stringify(_mutationChangeProfilePic()))
      .field('map', JSON.stringify({photo: ['variables.picture']}))
      .attach('picture', path.join(__dirname, './photo.jpg'));
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.changeProfilePic.profile_pic).toBe('new url');
    expect(res.body.data.changeProfilePic.username).toBe('testuser');
  });

  test('change password successful', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({query: mutationChangePassword('09876', '09876')});
    expect(res.body.errors).toBeUndefined();
    const compared = await bcrypt.compare(
      '09876',
      res.body.data.changePassword.password
    );
    expect(compared).toBe(true);
  });

  test('change password fails for mismatch', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', token)
      .send({
        query: mutationChangePassword('098765', '09876'),
      });
    expect(res.body.errors).not.toBeUndefined();
  });

  test('change password fails with wrong token', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'fakewrongtoken2334523452345164')
      .send({query: mutationChangePassword('09876', '09876')});
    expect(res.body.errors).not.toBeUndefined();
  });

  test('deleteSelf fails with wrong token', async () => {
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'fakewrongtoken2334523452345164')
      .send({query: mutationDeleteSelf()});
    expect(res.body.errors).not.toBeUndefined();
  });

  test('deleteSelf successfully deletes user and lingering comments', async () => {
    const comment = await createComment();
    const id = comment.author;
    const commenterToken = jsonwebtoken.sign({id: id}, config.jwtSecret!, {
      expiresIn: '1d',
    });
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', commenterToken)
      .send({query: mutationDeleteSelf()});
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.deleteSelf.id).toBe(id.toString());

    const comments = await Comment.find({});
    expect(comments.length).toBe(0);
  });

  test('deleteSelf successfully deletes lingering likes', async () => {
    const like = await createLike();
    const id = like.liker;
    const likerToken = jsonwebtoken.sign({id: id}, config.jwtSecret!, {
      expiresIn: '1d',
    });
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', likerToken)
      .send({query: mutationDeleteSelf()});
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.deleteSelf.id).toBe(id.toString());

    const likes = await Like.find({});
    expect(likes.length).toBe(0);
  });

  test('deleteSelf successfully deletes lingering posts', async () => {
    const post = await createPost();
    const id = post.author;
    const posterToken = jsonwebtoken.sign({id: id}, config.jwtSecret!, {
      expiresIn: '1d',
    });
    const res = await server
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', posterToken)
      .send({query: mutationDeleteSelf()});
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.deleteSelf.id).toBe(id.toString());

    const foundPost = await Post.findById(id);
    expect(foundPost).toBeNull();
  });
});

afterAll(() => {
  disconnectDb();
});
