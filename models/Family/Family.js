import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Family schema that has references to Tree schema
 */
const FamilySchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tree: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
    },
    fakeMember: {
      type: Schema.Types.ObjectId,
      ref: 'FakeMamber',
    },
    father: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    mother: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Family', FamilySchema);
