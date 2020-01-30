import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Memory schema that has references to User, Like and Comment schemas
 */
const MemorySchema = Schema(
    {
        text: {
            type: String,
            required: true
        },
        image: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'MemoryLike',
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'MemoryComment',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now
        },
        dateTo: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Memory', MemorySchema);
