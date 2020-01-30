import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Follow schema that has references to Tree schema
 */
const followSchema = Schema(
  {
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
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    following: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Follow', followSchema);
