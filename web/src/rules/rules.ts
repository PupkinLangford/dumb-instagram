import * as yup from 'yup';

export const loginRules = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(5),
});
