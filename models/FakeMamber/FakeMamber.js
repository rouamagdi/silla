import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * FakeMamber schema that has references trees schemas
 */
const FakeMamberSchema = new Schema(
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
    },
    image: String,
    imagePublicId: String,
    tree: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    father: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    mother: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('FakeMamber', FakeMamberSchema);
