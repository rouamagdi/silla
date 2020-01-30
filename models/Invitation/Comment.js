import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Invitation and user schemas
 */
const InvitationCommentSchema = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
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

export default mongoose.model('InvitationComment', InvitationCommentSchema);
