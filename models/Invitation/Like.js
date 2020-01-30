import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Like schema that has references to Invitation and User schema
 */
const InvitationLikeSchema = Schema(
  {
    invitation: {
      type: Schema.Types.ObjectId,
      ref: 'Invitation',
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

export default mongoose.model('InvitationLike', InvitationLikeSchema);
