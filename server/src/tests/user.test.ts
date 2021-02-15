import {createUser} from './utils';
import request from 'supertest';
import app from '../index';
import {IUser} from '../models/user';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import {disconnectDb} from '../db';
import bcrypt from 'bcrypt';

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

const mutationChangePassword = (password: string, passwordConfirm: string) => `
mutation {
  changePassword (password: "${password}", passwordConfirm: "${passwordConfirm}") 
  {
      password
  }
}`;

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

  afterAll(() => {
    disconnectDb();
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
});
