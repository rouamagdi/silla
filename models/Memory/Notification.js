import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User, Like and Comment schemas
 */
const memoryNotificationSchema = Schema(
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
    memory: {
      type: Schema.Types.ObjectId,
      ref: 'Memory',
    },
    like: {
      type: Schema.Types.ObjectId,
      ref: 'memoryLike',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'memoryComment',
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

export default mongoose.model('memoryNotification', memoryNotificationSchema);
