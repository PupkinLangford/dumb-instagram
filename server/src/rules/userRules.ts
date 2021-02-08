import * as yup from 'yup';
import bcrypt from 'bcrypt';
import User from '../models/user';
import {AnySchema} from 'yup';

export const signUpRules = yup.object().shape({
  username: yup
    .string()
    .trim()
    .lowercase()
    .required()
    .test('uniqueUsername', 'Username already exists', async username => {
      const foundUser = await User.findOne({username});
      return !foundUser;
    }),
  password: yup
    .string()
    .trim()
    .required()
    .min(5, 'Password must be at least 5 characters'),
  passwordConfirm: yup
    .string()
    .trim()
    .required()
    .min(5)
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
  email: yup.string().email().required(),
});

export const loginRules = yup.object().shape({
  username: yup
    .string()
    .trim()
    .lowercase()
    .required()
    .test(
      'usernamePasswordCheck',
      'Invalid Username or Password',
      async username => {
        const foundUser = await User.findOne({username});
        return !!foundUser;
      }
    ),
  password: yup
    .string()
    .trim()
    .required()
    .min(5)
    .when('username', (username: string, schema: AnySchema) =>
      schema.test({
        test: async (password: string) => {
          const foundUser = await User.findOne({username});
          const match = await bcrypt.compare(password, foundUser!.password);
          return match;
        },
        message: 'Invalid Username or Password',
      })
    ),
});
