import {Document, model, Schema} from 'mongoose';
import {DateTime} from 'luxon';

export interface ILike extends Document {
  liker: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  timestamp: Date;
}

const LikeSchema = new Schema(
  {
    liker: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    timestamp: {type: Date, default: Date.now, required: true},
  },
  {toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

LikeSchema.virtual('format_date').get(function (this: ILike) {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

export default model<ILike>('Like', LikeSchema);
