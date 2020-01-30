import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User, Like, Comment schemas
 */
const testimonialNotificationSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tree: {
      type: Schema.Types.ObjectId,
      ref: 'Tree'
    },
    like: {
      type: Schema.Types.ObjectId,
      ref: 'testimonialLike'
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'testimonialComment'
    },
    seen: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('testimonialNotification', testimonialNotificationSchema);
