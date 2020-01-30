import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * PhotoAlbum schema that has reference to Post and user schemas
 */
const PhotoAlbumSchema = Schema(
    {
        image: {
            type: String
        },
        text: {
            type: String
        },
        tree: {
            type: Schema.Types.ObjectId,
            ref: 'Tree',
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

export default mongoose.model('PhotoAlbum', PhotoAlbumSchema);
