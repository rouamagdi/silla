import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
    /**
     * Gets all Familys
     *
     * @param {string} authUserId
     * @param {string} treeId
     * @param {string} fatherId
     * @param {string} motherId
     * @param {string} fakeMamberId
     * @param {int} skip how many familys to skip
     * @param {int} limit how many Familys to limit
     */
    getFamilys: async (root, { authUserId, treeId, fakeMamberId, skip, limit }, { Family }) => {
        const query = {
            $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }, { tree: { $ne: treeId } }, { fakeMamber: { $ne: fakeMamberId } }, { father: { $ne: fatherId } },{ mother: { $ne: motherId } },],
        };
        const familysCount = await Family.find(query).countDocuments();
        const allFamilys = await Family.find(query)
            .populate('author')
            .populate('fakeMamber')
            .populate('father')
            .populate('mother')
            .populate('tree')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 'desc' });

        return { familys: allFamilys, count: familysCount };
    },
    /**
     * Gets Familys from followed users
     *
     * @param {string} userId
     * @param {string} treeId
     * @param {string} fatherId
     * @param {string} motherId
     * @param {string} fakeMamberId
     * @param {int} skip how many familys to skip
     * @param {int} limit how many familys to limit
     */
    /**
     * Gets Familys by id
     *
     * @param {string} id
     */
    getFamily: async (root, { id }, { Family }) => {
        const family = await Family.findById(id)
            .populate('author')
            .populate('tree')
            .populate('fakeMamber')
            .populate('father')
            .populate('mother');
        return family;
    },
};

const Mutation = {
    /**
     * Creates a new family
     *
     * @param {string} treeId
     * @param {string} fatherId
     * @param {string} motherId
     * @param {string} authorId
     */
    createFamily: async (
        root,
        { input: { treeId, authorId, fatherId, motherId, fakeMamberId } },
        { Family, User, Tree, FakeMamber }
    ) => {

        const newFamily = await new Family({
            father: fatherId,
            mother: motherId,
            fakeMamber: fakeMamberId,
            tree: treeId,
            author: authorId,
        }).save();

        await User.findOneAndUpdate(
            { _id: authorId },
            { $push: { familys: newFamily.id } }
        );

        await Tree.findOneAndUpdate(
            { _id: treeId },
            { $push: { familys: newFamily.id } }
        );

        await FakeMamber.findOneAndUpdate(
            { _id: fakeMamberId },
            { $pull: { familys: family.id } }
        );
        return newFamily;
    },
    /**
     * Deletes a user family
     *
     * @param {string} id
     * @param {imagePublicId} id
     */
    deleteFamily: async (
        root,
        { input: { id, imagePublicId, fakeMamberId, treeId } },
        { Family, Tree, User, FakeMamber }
    ) => {
        // Remove Family image from cloudinary, if imagePublicId is present
        if (imagePublicId) {
            const deleteImage = await deleteFromCloudinary(imagePublicId);

            if (deleteImage.result !== 'ok') {
                throw new Error(
                    'Something went wrong while deleting image from Cloudinary'
                );
            }
        }

        // Find Family and remove it
        const family = await Family.findByIdAndRemove(id);

        // Delete family from authors (users) familys collection
        await User.findOneAndUpdate(
            { _id: family.author },
            { $pull: { familys: family.id } }
        );

        await Tree.findOneAndUpdate(
            { _id: treeId },
            { $push: { familys: family.id } }
        );

        await FakeMamber.findOneAndUpdate(
            { _id: fakeMamberId },
            { $pull: { familys: family.id } }
        );

        return family;
    },
};

export default { Query, Mutation };