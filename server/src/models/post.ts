import {DateTime} from 'luxon';
import {Document, HookNextFunction, model, Schema} from 'mongoose';
import Comment from './comment';
import Like from './like';

export interface IPost extends Document {
  photo: string;
  caption: string;
  author: Schema.Types.ObjectId;
  location: string;
  timestamp: Date;
}

const PostSchema = new Schema(
  {
    photo: {type: String, required: true},
    caption: {type: String, required: true, default: ''},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    location: {type: String},
    timestamp: {type: Date, required: true, default: Date.now},
  },
  {toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

PostSchema.virtual('format_date').get(function (this: IPost) {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

PostSchema.virtual('snippet').get(function (this: IPost) {
  return this.caption.slice(0, 50);
});

PostSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

PostSchema.virtual('likes', {
  ref: 'Like',
  foreignField: 'post',
  localField: '_id',
});

PostSchema.pre(
  'deleteOne',
  {document: true, query: false},
  async function (this: IPost, next: HookNextFunction) {
    const post_id = this._id;
    await Comment.deleteMany({post: post_id});
    await Like.deleteMany({post: post_id});
    return next();
  }
);

export default model<IPost>('Post', PostSchema);
