import jsonwebtoken from 'jsonwebtoken';
import config from '../config';

type ValidateResponse = {
  id: string;
  username: string;
  iat: number;
  exp: number;
};

export const jwtValidate = (token: string | undefined): ValidateResponse => {
  if (!token) token = '';
  return jsonwebtoken.verify(token, config.jwtSecret) as ValidateResponse;
};

// invalidate tokens for users which don't exist.
// jwtValidate returns object with user's old id and username for deleted user.
// Consider verifying username in DB before returning.
