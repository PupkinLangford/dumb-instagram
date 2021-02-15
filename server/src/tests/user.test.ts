import {createUser} from './utils';
import request from 'supertest';
import app from '../index';
import {IUser} from '../models/user';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import {disconnectDb} from '../db';

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

describe('User mutations', () => {
  let user: IUser;
  let server: request.SuperTest<request.Test>;
  let token: string;
  beforeAll(async () => {
    server = request(app);
    user = await createUser();
    token = jsonwebtoken.sign({id: user._id}, config.jwtSecret!, {
      expiresIn: '1d',
    });
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
  });

  afterAll(() => {
    disconnectDb();
  });
});
