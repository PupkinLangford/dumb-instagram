import {Document, model, Schema} from 'mongoose';
import {DateTime} from 'luxon';

export interface IComment extends Document {
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  content: string;
  timestamp: Date;
}

const CommentSchema = new Schema(
  {
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    timestamp: {type: Date, default: Date.now, required: true},
  },
  {toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

CommentSchema.virtual('format_date').get(function (this: IComment) {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

export default model<IComment>('Comment', CommentSchema);
