import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User, Like and Comment schemas
 */
const invitationNotificationSchema = Schema(
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
    invitation: {
      type: Schema.Types.ObjectId,
      ref: 'Invitation',
    },
    like: {
      type: Schema.Types.ObjectId,
      ref: 'invitationLike',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'invitationComment',
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

export default mongoose.model('invitationNotification', invitationNotificationSchema);
