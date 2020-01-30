import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Like schema that has references to Memory and User schema
 */
const MemoryLikeSchema = Schema(
  {
    memory: {
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

export default mongoose.model('MemoryLike', MemoryLikeSchema);
