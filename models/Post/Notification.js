import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User, Like and Comment schemas
 */
const postNotificationSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tree: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    like: {
      type: Schema.Types.ObjectId,
      ref: 'postLike',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'postComment',
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('postNotification', postNotificationSchema);
