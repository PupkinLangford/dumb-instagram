/* eslint-disable @typescript-eslint/no-explicit-any */
import {changeNameRules, loginRules, signUpRules} from '../../rules/userRules';
import User from '../../models/user';
import {GraphQLError} from 'graphql';
import jsonwebtoken from 'jsonwebtoken';
import config from '../../config';
import {jwtValidate} from '../../middlewares/jwtValidate';

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

export async function changeName(_parent: unknown, args: any, {headers}: any) {
  try {
    await changeNameRules.validate(args);
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const {first_name, last_name} = args;
    return User.findByIdAndUpdate(
      user.id,
      {first_name, last_name},
      {new: true}
    );
  } catch (err) {
    return new GraphQLError(err);
  }
}
