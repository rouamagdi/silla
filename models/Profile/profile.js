import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * profile schema that has reference to Post and user schemas
 */
const ProfileSchema = Schema(
    {
        nickname: {
            type: String,
            required: true
        },
        job: {
            type: String
        },
        Bio: {
            type: String
        },
        academicAertificate: {
            type: String
        },
        address: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        hobbys: {
            type: String
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        memory: {
            type: Schema.Types.ObjectId,
            ref: 'Memory',
        },
        achievements: {
            type: Schema.Types.ObjectId,
            ref: 'Achievement',
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Profile', ProfileSchema);
