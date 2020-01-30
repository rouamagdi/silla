import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Invitation schema that has references to User, Like and Comment schemas
 */
const InvitationSchema = Schema(
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
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'InvitationLike',
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'InvitationComment',
            },
        ],
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

export default mongoose.model('Invitation', InvitationSchema);
