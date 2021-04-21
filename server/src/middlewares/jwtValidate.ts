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
