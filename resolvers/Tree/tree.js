import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
    /**
     * Gets all Trees
     *
     * @param {string} authUserId
     * @param {int} skip how many trees to skip
     * @param {int} limit how many trees to limit
     */
    getTrees: async (root, { authUserId, skip, limit }, { Tree }) => {
        const query = {
            $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }],
        };
        const treesCount = await Tree.find(query).countDocuments();
        const allTrees = await Tree.find(query)
            .populate({
                path: 'tree',
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

        return { trees: allTrees, count: treesCount };
    },
    /**
     * Gets trees from followed users
     *
     * @param {string} authorId
     * @param {int} skip how many trees to skip
     * @param {int} limit how many trees to limit
     */
    getFollowedTrees: async (root, { treeId, skip, limit }, { Tree, Follow }) => {
        // Find user ids, that current user follows
        const userFollowing = [];
        const follow = await Follow.find({ follower: treeId }, { _id: 0 }).select(
            'tree'
        );
        follow.map(f => userFollowing.push(f.user));

        // Find user tree and followed trees by using userFollowing ids array
        const query = {
            $or: [{ author: { $in: userFollowing } }, { author: authorId }],
        };
        const followedTreesCount = await Tree.find(query).countDocuments();
        const followedTrees = await Tree.find(query)
            .populate({
                path: 'tree',
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

        return { trees: followedTrees, count: followedTreesCount };
    },
    /**
     * Gets tree by id
     *
     * @param {string} id
     */
    getTree: async (root, { id }, { Tree }) => {
        const tree = await Tree.findById(id)
        .populate({
            path: 'tree',
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

        return tree;
    },
};

const Mutation = {
    /**
     * Creates a new tree
     *
     * @param {string} treename
     * @param {string} image
     * @param {string} authorId
     */
    createTree: async (
        root,
        { input: { treename, image, authorId } },
        { Tree, User }
    ) => {
        if (!treename && !image) {
            throw new Error('Tree tree name or image is required.');
        }

        let imageUrl, imagePublicId;
        if (image) {
            const { createReadStream } = await image;
            const stream = createReadStream();
            const uploadImage = await uploadToCloudinary(stream, 'tree');

            if (!uploadImage.secure_url) {
                throw new Error(
                    'Something went wrong while uploading image to Cloudinary'
                );
            }

            imageUrl = uploadImage.secure_url;
            imagePublicId = uploadImage.public_id;
        }

        const newTree = await new Tree({
            treename,
            image: imageUrl,
            imagePublicId,
            author: authorId,
        }).save();

        await User.findOneAndUpdate(
            { _id: authorId },
            { $push: { trees: newTree.id } }
        );

        return newTree;
    },
    /**
     * Deletes a user tree
     *
     * @param {string} id
     * @param {imagePublicId} id
     */
    deleteTree: async (
        root,
        { input: { id, imagePublicId } },
        { Tree, Donation, User, Follow, Post, Invitation, Memory, Testimonial, Notification }
    ) => {
        // Remove tree image from cloudinary, if imagePublicId is present
        if (imagePublicId) {
            const deleteImage = await deleteFromCloudinary(imagePublicId);

            if (deleteImage.result !== 'ok') {
                throw new Error(
                    'Something went wrong while deleting image from Cloudinary'
                );
            }
        }

        // Find tree and remove it
        const tree = await Tree.findByIdAndRemove(id);

        // Delete tree from authors (users) trees collection
        await User.findOneAndUpdate(
            { _id: tree.author },
            { $pull: { trees: tree.id } }
        );

        // Delete tree donations from donations collection
        await Donation.find({ tree: tree.id }).deleteMany();
        // Delete donations from users collection
        tree.donations.map(async donationId => {
            await User.where({ donations: donationId }).update({
                $pull: { donations: donationId },
            });
        });

        // Delete tree followers from follows collection
        await Follow.find({ tree: tree.id }).deleteMany();
        // Delete followers from users collection
        tree.followers.map(async followId => {
            await User.where({ follows: followId }).update({
                $pull: { followers: followId },
            });
        });

        // Delete tree posts from posts collection
        await Post.find({ tree: tree.id }).deleteMany();
        // Delete posts from users collection
        tree.posts.map(async postId => {
            await User.where({ posts: postId }).update({
                $pull: { posts: postId },
            });
        });

        // Delete tree invitations from invitations collection
        await Invitation.find({ tree: tree.id }).deleteMany();
        // Delete invitations from users collection
        tree.invitations.map(async invitationId => {
            await User.where({ invitations: invitationId }).update({
                $pull: { invitations: invitationId },
            });
        });

        // Delete tree memorys from memorys collection
        await Memory.find({ tree: tree.id }).deleteMany();
        // Delete memorys from users collection
        tree.memorys.map(async memoryId => {
            await User.where({ memorys: memoryId }).update({
                $pull: { memorys: memoryId },
            });
        });

        // Delete tree testimonials from testimonials collection
        await Testimonial.find({ tree: tree.id }).deleteMany();
        // Delete testimonials from users collection
        tree.testimonials.map(async testimonialId => {
            await User.where({ testimonialts: testimonialId }).update({
                $pull: { testimonials: testimonialId },
            });
        });

        // Find user notification in users collection and remove them
        const userNotifications = await Notification.find({ tree: tree.id });

        userNotifications.map(async notification => {
            await User.where({ notifications: notification.id }).update({
                $pull: { notifications: notification.id },
            });
        });
        // Remove notifications from notifications collection
        await Notification.find({ tree: tree.id }).deleteMany();

        return tree;
    },
};

export default { Query, Mutation };
