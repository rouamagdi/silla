import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Like schema that has references to Donation and User schema
 */
const DonationLikeSchema = Schema(
  {
    donation: {
      type: Schema.Types.ObjectId,
      ref: 'Donation',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('DonationLike', DonationLikeSchema);
