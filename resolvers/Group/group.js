import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
    /**
     * Gets all Groups
     *
     * @param {string} authUserId
     * @param {int} skip how many Groups to skip
     * @param {int} limit how many Groups to limit
     */
    getGroups: async (root, { authUserId, skip, limit }, { Group }) => {
        const query = {
            $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }],
        };
        const groupsCount = await Group.find(query).countDocuments();
        const allGroups = await Group.find(query)
            .populate({
                path: 'group',
                populate: [
                    {
                        path: 'posts',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'invitations',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'donations',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'testimonials',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'memorys',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'followers',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'notifications',
                        populate: [
                            { path: 'posts' },
                            { path: 'invitations' },
                            { path: 'donations' },
                            { path: 'testimonials' },
                            { path: 'memorys' },
                            { path: 'followers' },
                        ],
                    },
                ],
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 'desc' });

        return { groups: allGroups, count: groupsCount };
    },
    /**
     * Gets Groups from followed users
     *
     * @param {string} authorId
     * @param {int} skip how many Groups to skip
     * @param {int} limit how many Groups to limit
     */
    getFollowedGroups: async (root, { groupId, skip, limit }, { Group, Follow }) => {
        // Find user ids, that current user follows
        const userFollowing = [];
        const follow = await Follow.find({ follower: groupId }, { _id: 0 }).select(
            'group'
        );
        follow.map(f => userFollowing.push(f.user));

        // Find user group and followed groups by using userFollowing ids array
        const query = {
            $or: [{ author: { $in: userFollowing } }, { author: authorId }],
        };
        const followedGroupsCount = await Group.find(query).countDocuments();
        const followedGroups = await Group.find(query)
            .populate({
                path: 'group',
                populate: [
                    {
                        path: 'posts',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'invitations',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'donations',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'testimonials',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'memorys',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'followers',
                        options: { sort: { createdAt: 'desc' } },
                        populate: { path: 'author' },
                    },
                    {
                        path: 'notifications',
                        populate: [
                            { path: 'posts' },
                            { path: 'invitations' },
                            { path: 'donations' },
                            { path: 'testimonials' },
                            { path: 'memorys' },
                            { path: 'followers' },
                        ],
                    },
                ],
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 'desc' });

        return { groups: followedGroups, count: followedGroupsCount };
    },
    /**
     * Gets group by id
     *
     * @param {string} id
     */
    getGroup: async (root, { id }, { Group }) => {
        const group = await Group.findById(id)
        .populate({
            path: 'group',
            populate: [
                {
                    path: 'posts',
                    options: { sort: { createdAt: 'desc' } },
                    populate: { path: 'author' },
                },
                {
                    path: 'invitations',
                    options: { sort: { createdAt: 'desc' } },
                    populate: { path: 'author' },
                },
                {
                    path: 'donations',
                    options: { sort: { createdAt: 'desc' } },
                    populate: { path: 'author' },
                },
                {
                    path: 'testimonials',
                    options: { sort: { createdAt: 'desc' } },
                    populate: { path: 'author' },
                },
                {
                    path: 'memorys',
                    options: { sort: { createdAt: 'desc' } },
                    populate: { path: 'author' },
                },
                {
                    path: 'followers',
                    options: { sort: { createdAt: 'desc' } },
                    populate: { path: 'author' },
                },
                {
                    path: 'notifications',
                    populate: [
                        { path: 'posts' },
                        { path: 'invitations' },
                        { path: 'donations' },
                        { path: 'testimonials' },
                        { path: 'memorys' },
                        { path: 'followers' },
                    ],
                },
            ],
        });

        return group;
    },
};

const Mutation = {
    /**
     * Creates a new group
     *
     * @param {string} groupname
     * @param {string} image
     * @param {string} authorId
     */
    createGroup: async (
        root,
        { input: { groupname, image, authorId } },
        { Group, User }
    ) => {
        if (!groupname && !image) {
            throw new Error('Group  groupname or image is required.');
        }

        let imageUrl, imagePublicId;
        if (image) {
            const { createReadStream } = await image;
            const stream = createReadStream();
            const uploadImage = await uploadToCloudinary(stream, 'group');

            if (!uploadImage.secure_url) {
                throw new Error(
                    'Something went wrong while uploading image to Cloudinary'
                );
            }

            imageUrl = uploadImage.secure_url;
            imagePublicId = uploadImage.public_id;
        }

        const newGroup = await new Group({
            groupname,
            image: imageUrl,
            imagePublicId,
            author: authorId,
        }).save();

        await User.findOneAndUpdate(
            { _id: authorId },
            { $push: { groups: newGroup.id } }
        );

        return newGroup;
    },
    /**
     * Deletes a user group
     *
     * @param {string} id
     * @param {imagePublicId} id
     */
    deleteGroup: async (
        root,
        { input: { id, imagePublicId } },
        { Group, Donation, User, Follow, Post, Invitation, Memory, Testimonial, Notification }
    ) => {
        // Remove group image from cloudinary, if imagePublicId is present
        if (imagePublicId) {
            const deleteImage = await deleteFromCloudinary(imagePublicId);

            if (deleteImage.result !== 'ok') {
                throw new Error(
                    'Something went wrong while deleting image from Cloudinary'
                );
            }
        }

        // Find group and remove it
        const group = await Group.findByIdAndRemove(id);

        // Delete group from authors (users) groups collection
        await User.findOneAndUpdate(
            { _id: group.author },
            { $pull: { groups: group.id } }
        );

        // Delete group donations from donations collection
        await Donation.find({ group: group.id }).deleteMany();
        // Delete donations from users collection
        group.donations.map(async donationId => {
            await User.where({ donations: donationId }).update({
                $pull: { donations: donationId },
            });
        });

        // Delete group followers from follows collection
        await Follow.find({ group: group.id }).deleteMany();
        // Delete followers from users collection
        group.followers.map(async followId => {
            await User.where({ follows: followId }).update({
                $pull: { followers: followId },
            });
        });

        // Delete group posts from posts collection
        await Post.find({ group: group.id }).deleteMany();
        // Delete posts from users collection
        group.posts.map(async postId => {
            await User.where({ posts: postId }).update({
                $pull: { posts: postId },
            });
        });

        // Delete group invitations from invitations collection
        await Invitation.find({ group: group.id }).deleteMany();
        // Delete invitations from users collection
        group.invitations.map(async invitationId => {
            await User.where({ invitations: invitationId }).update({
                $pull: { invitations: invitationId },
            });
        });

        // Delete group memorys from memorys collection
        await Memory.find({ group: group.id }).deleteMany();
        // Delete memorys from users collection
        group.memorys.map(async memoryId => {
            await User.where({ memorys: memoryId }).update({
                $pull: { memorys: memoryId },
            });
        });

        // Delete group testimonials from testimonials collection
        await Testimonial.find({ group: group.id }).deleteMany();
        // Delete testimonials from users collection
        group.testimonials.map(async testimonialId => {
            await User.where({ testimonialts: testimonialId }).update({
                $pull: { testimonials: testimonialId },
            });
        });

        // Find user notification in users collection and remove them
        const userNotifications = await Notification.find({ group: group.id });

        userNotifications.map(async notification => {
            await User.where({ notifications: notification.id }).update({
                $pull: { notifications: notification.id },
            });
        });
        // Remove notifications from notifications collection
        await Notification.find({ group: group.id }).deleteMany();

        return group;
    },  
};

export default { Query, Mutation };
