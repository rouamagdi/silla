import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * tree schema that has references to User, Post, Invitation, Donation, Testimonial schemas
 */
const TreeSchema = Schema(
    {
        treename: String,
        image: String,
        imagePublicId: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        memorys: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Memory'
            }
        ],
        invitations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Invitation'
            }
        ],
        donations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Donation'
            }
        ],
        testimonials: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Testimonial'
            }
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Follow',
            }
        ],
        photoAlbum:[
            {
                type: Schema.Types.ObjectId,
                ref: 'PhotoAlbum',
            }
        ],
        messages: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Message'
            }
          ],
        FakeMamber:[
            {
                type: Schema.Types.ObjectId,
                ref: 'FakeMamber',
            }
        ],
        Family:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Family',
            }
        ],
        treeNotifications: [
            {
                type: Schema.Types.ObjectId,
                ref: 'treeNotification',
            }
        ]
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Tree', TreeSchema);
