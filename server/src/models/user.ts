import {Document, HookNextFunction, model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  profile_pic: string;
  bio?: string;
}

const UserSchema = new Schema(
  {
    first_name: {type: String, required: true, default: 'Dumb'},
    last_name: {type: String, required: true, default: 'User'},
    username: {type: String, required: true},
    password: {type: String, required: true, minLength: 5},
    email: {type: String, required: true},
    profile_pic: {type: String, required: true, default: 'default'},
    bio: {type: String},
  },
  {toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

UserSchema.virtual('full_name').get(function (this: IUser) {
  return this.first_name + ' ' + this.last_name;
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

export default model<IUser>('User', UserSchema);
