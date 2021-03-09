import * as yup from 'yup';

export const loginRules = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(5),
});

export const signUpRules = yup.object().shape({
  username: yup.string().required(),
  password: yup
    .string()
    .required()
    .min(5, 'Password must be at least 5 characters'),
  passwordConfirm: yup
    .string()
    .required()
    .min(5)
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
  email: yup.string().email().required(),
});

export const editProfileRules = yup.object().shape({
  firstName: yup.string().trim().required().min(1, 'Name may not be empty'),
  lastName: yup.string().trim().required().min(1, 'Name may not be empty'),
  email: yup.string().trim().email().required(),
  emailConfirm: yup
    .string()
    .trim()
    .email()
    .required()
    .oneOf([yup.ref('email'), null], 'Emails do not match'),
});
