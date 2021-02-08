/* eslint-disable @typescript-eslint/no-explicit-any */
import {loginRules, signUpRules} from '../../rules/userRules';
import User from '../../models/user';
import {GraphQLError} from 'graphql';
import jsonwebtoken from 'jsonwebtoken';
import config from '../../config';

export async function signup(_parent: unknown, args: any) {
  try {
    await signUpRules.validate(args);

    const user = new User({
      username: args.username,
      password: args.password,
      email: args.email,
    });
    return await user.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function login(_parent: unknown, args: any) {
  try {
    await loginRules.validate(args);
    const username = args.username;
    const user = await User.findOne({username});

    if (!user) {
      return {token: '', user: null};
    }

    const token = jsonwebtoken.sign(
      {id: user._id, username: user.username},
      config.jwtSecret,
      {expiresIn: '3h'}
    );
    return {token, user};
  } catch (err) {
    return new GraphQLError(err);
  }
}
