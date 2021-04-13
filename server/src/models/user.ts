import {Document, HookNextFunction, model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import Comment from './comment';
import Like from './like';
import Post from './post';
import Follow from './follow';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  bio?: string;
}

const UserSchema = new Schema(
  {
    first_name: {type: String, required: true, default: 'Dumb'},
    last_name: {type: String, required: true, default: 'User'},
    username: {type: String, required: true},
    password: {type: String, required: true, minLength: 5},
    email: {type: String, required: true},
    bio: {type: String},
  },
  {toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

UserSchema.virtual('full_name').get(function (this: IUser) {
  return this.first_name + ' ' + this.last_name;
});

UserSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'author',
  localField: '_id',
  options: {sort: {timestamp: -1}},
});

UserSchema.virtual('following', {
  ref: 'Follow',
  foreignField: 'follower',
  localField: '_id',
});

UserSchema.virtual('followers', {
  ref: 'Follow',
  foreignField: 'following',
  localField: '_id',
});

UserSchema.pre(
  'save',
  async function (this: IUser, next: HookNextFunction): Promise<void> {
    if (!this.password) {
      next();
    }
    const hashedWord = await bcrypt.hash(this.password, 10);
    this.password = hashedWord;
    next();
  }
);

UserSchema.pre(
  'deleteOne',
  {document: true, query: false},
  async function (this: IUser, next: HookNextFunction) {
    const user_id = this._id;
    const [posts] = await Promise.all([
      Post.find({author: user_id}),
      Comment.deleteMany({author: user_id}),
      Like.deleteMany({liker: user_id}),
      Follow.deleteMany({follower: user_id}),
      Follow.deleteMany({following: user_id}),
    ]);
    await posts.forEach(post => {
      post.deleteOne();
    });
    return next();
  }
);

export default model<IUser>('User', UserSchema);
