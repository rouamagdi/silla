import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

/**
 * User schema that has references to Post, Like, Comment, Follow and Notification schemas
 */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true
    },
    gender: {
      type: String
    },
    phone: {
      type: String,
      unique: true
    },
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    password: {
      type: String,
      default: '1234'
    },
    image: String,
    imagePublicId: String,
    country:String,
    profile:{
      type:Schema.Types.ObjectId,
      ref: 'Profile'
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
     messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    notificationEnable: {
      type: Boolean,
      default: true
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'profile',
    },
    trees: [
      {
        tree: {
          type: Schema.Types.ObjectId,
          ref: 'Tree',
        },
        photoAlbum: {
          type: Schema.Types.ObjectId,
          ref: 'photoAlbum',
        },
        posts: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Post',
          },
        ],
        chats: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Chat',
          },
        ],
        contacts: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        memorys: {
          type: Schema.Types.ObjectId,
          ref: 'Memory',
        },
        invitations: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Invitation'
          }
        ],
        donations: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Donation'
          }
        ],
        testimonials: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Testimonial'
          }
        ],
      },
    ],
    memoryNotifications: {
      type: Schema.Types.ObjectId,
      ref: 'memoryNotification',
    },
    postNotifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'postNotification',
      },
    ],
    invitationNotifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'invitationNotification'
      }
    ],
    donationNotifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'donationNotification'
      }
    ],
    testimonialNotifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'testimonialNotification'
      }
    ],
    followNotifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'followNotification',
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
  }
  },
  {
    timestamps: true,
  }
);

/**
 * Hashes the users password when saving it to DB
 */
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

export default mongoose.model('User', UserSchema);
