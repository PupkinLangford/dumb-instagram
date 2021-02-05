import yup from 'yup';
import bcrypt from 'bcrypt';
import User from '../models/user';

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
  password: yup.string().trim().required().min(5),
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
        if (!foundUser) {
          return false;
        } else {
          const passwordMatch = await bcrypt.compare(
            yup.ref('password'),
            foundUser.password
          );
          return passwordMatch;
        }
      }
    ),
});
