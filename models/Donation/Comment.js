import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Donation and user schemas
 */
const DonationCommentSchema = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
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

export default mongoose.model('DonationComment', DonationCommentSchema);
