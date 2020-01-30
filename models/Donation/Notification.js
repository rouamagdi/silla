import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User, Like and Comment schemas
 */
const notificationSchema = Schema(
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
    donation: {
      type: Schema.Types.ObjectId,
      ref: 'Donation',
    },
    like: {
      type: Schema.Types.ObjectId,
      ref: 'donationLike',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'donationComment',
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

export default mongoose.model('donationNotification', notificationSchema);
