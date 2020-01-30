import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Memory and user schemas
 */
const MemoryCommentSchema = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    donation: {
      type: Schema.Types.ObjectId,
      ref: 'Memory',
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

export default mongoose.model('MemoryComment', MemoryCommentSchema);
