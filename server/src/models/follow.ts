import {DateTime} from 'luxon';
import {Document, model, Schema} from 'mongoose';

export interface IFollow extends Document {
  follower: Schema.Types.ObjectId;
  following: Schema.Types.ObjectId;
  timestamp: Date;
}

const FollowSchema = new Schema(
  {
    follower: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    following: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    timestamp: {type: Date, required: true, default: Date.now},
  },
  {toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

FollowSchema.virtual('format_date').get(function (this: IFollow) {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

export default model<IFollow>('Follow', FollowSchema);
