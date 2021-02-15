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
  email: yup.string().trim().email().required(),
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
          if (!foundUser) return false;
          const match = await bcrypt.compare(password, foundUser!.password);
          return match;
        },
        message: 'Invalid Username or Password',
      })
    ),
});

export const changeNameRules = yup.object().shape({
  first_name: yup.string().trim().required().min(1, 'Name may not be empty'),
  last_name: yup.string().trim().required().min(1, 'Name may not be empty'),
});

export const changeEmailRules = yup.object().shape({
  email: yup.string().trim().email().required(),
  emailConfirm: yup
    .string()
    .trim()
    .email()
    .required()
    .oneOf([yup.ref('email'), null], 'Emails do not match'),
});

export const changePasswordRules = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required()
    .min(5, 'Password must be at least 5 characters'),
  passwordConfirm: yup
    .string()
    .trim()
    .required()
    .min(5, 'Password must be at least 5 characters')
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});
