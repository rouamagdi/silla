import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Achievement schema that has reference to Post and user schemas
 */
const AchievementSchema = Schema(
    {
        nationalism: {
            type: [String]
        },
        scientific: {
            type: [String]
        },
        occupational: {
            type: [String]
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Achievement', AchievementSchema);
