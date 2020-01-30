import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Follow schema that has references to Tree schema
 */
const followNotificationSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tree: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
    },
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
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

export default mongoose.model('followNotification', followNotificationSchema);
