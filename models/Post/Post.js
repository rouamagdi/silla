import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Post schema that has references to User, Like and Comment schemas
 */
const PostSchema = Schema(
  {
    text: String,
    image: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tree: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PostLike',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PostComment',
      },
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

export default mongoose.model('Post', PostSchema);