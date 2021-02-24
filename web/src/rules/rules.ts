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
