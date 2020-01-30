import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Donation schema that has references to User, Like and Comment schemas
 */
const DonationSchema = Schema(
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
        tree: {
            type: Schema.Types.ObjectId,
            ref: 'Tree',
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'DonationLike',
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'DonationComment',
            },
        ],
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
          },
        count: {
            type: Number
        },
        mount: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        dateTo: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Donation', DonationSchema);
