import {
  changeEmailRules,
  changeNameRules,
  changePasswordRules,
  loginRules,
  signUpRules,
} from '../../rules/userRules';
import User from '../../models/user';
import {GraphQLError} from 'graphql';
import jsonwebtoken from 'jsonwebtoken';
import config from '../../config';
import {jwtValidate} from '../../middlewares/jwtValidate';
import bcrypt from 'bcrypt';
import {Request} from 'express';
import {FileUpload} from 'graphql-upload';
import {deleteFolder, deleteImage, uploadImage} from './imageFunctions';

export async function signup(
  _parent: unknown,
  args: {
    username?: string;
    password?: string;
    passwordConfirm?: string;
    email?: string;
  }
) {
  try {
    await signUpRules.validate(args);

    const user = new User({
      username: args.username?.trim().toLowerCase(),
      password: args.password,
      email: args.email,
    });
    return await user.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function login(
  _parent: unknown,
  args: {username?: string; password?: string}
) {
  try {
    await loginRules.validate(args);
    const username = args.username?.trim().toLowerCase();
    const user = await User.findOne({username});

    if (!user) {
      return {token: '', user: null};
    }

    const token = jsonwebtoken.sign(
      {id: user._id, username: user.username},
      config.jwtSecret,
      {expiresIn: '3d'}
    );
    return {token, user};
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function changeName(
  _parent: unknown,
  args: {first_name?: string; last_name?: string},
  {headers}: Request
) {
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
export async function changeEmail(
  _parent: unknown,
  args: {email?: string; emailConfirm?: string},
  {headers}: Request
) {
  try {
    await changeEmailRules.validate(args);
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const {email} = args;
    return User.findByIdAndUpdate(user.id, {email}, {new: true});
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function changeBio(
  _parent: unknown,
  args: {bio?: string},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const {bio} = args;
    return User.findByIdAndUpdate(user.id, {bio}, {new: true});
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function changePassword(
  _parent: unknown,
  args: {password?: string; passwordConfirm?: string},
  {headers}: Request
) {
  try {
    await changePasswordRules.validate(args);
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const password = await bcrypt.hash(args.password, 10);
    return User.findByIdAndUpdate(user.id, {password}, {new: true});
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function changeProfilePic(
  _parent: unknown,
  args: {picture?: FileUpload},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const profile_pic = await uploadImage(
      args.picture!,
      user.id,
      'profile_pic'
    );
    if (profile_pic === '') {
      return new GraphQLError('Upload failed');
    }
    return true;
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function deleteProfilePic(
  _parent: unknown,
  _args: {},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    const id = user.id;
    deleteImage(id + '/profile_pic');
    return true;
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function deleteSelf(
  _parent: unknown,
  _args: {},
  {headers}: Request
) {
  try {
    const {authorization} = headers;
    const user = jwtValidate(authorization);
    deleteFolder(user.id);
    const foundUser = await User.findById(user.id);
    return await foundUser!.deleteOne();
  } catch (err) {
    return new GraphQLError(err);
  }
}
