import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * message schema that has reference to chat and user schemas
 */
const messageSchema = Schema(
  {
    message: {
      type: String,
      required: true,
    },
    tree: {
      type: Schema.Types.ObjectId,
      ref: 'Tree',
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    sender: 
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Message', messageSchema);
