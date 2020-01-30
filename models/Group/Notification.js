import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User, Post, Invitation, Donation, Follow and Testimonial schemas
 */
const groupNotificationSchema = Schema(
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
    memorys: {
      type: Schema.Types.ObjectId,
      ref: 'memoryNotification',
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'postNotification',
      },
    ],
    invitations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'invitationNotification'
      }
    ],
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'donationNotification'
      }
    ],
    testimonials: [
      {
        type: Schema.Types.ObjectId,
        ref: 'testimonialNotification'
      }
    ],
    follow: [
      {
        type: Schema.Types.ObjectId,
        ref: 'followNotification',
      }
    ],
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('groupNotification', groupNotificationSchema);