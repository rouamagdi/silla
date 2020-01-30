import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
    /**
     * Gets all FakeMambers
     *
     * @param {string} authUserId
     * @param {string} treeId
     * @param {int} skip how many FakeMambers to skip
     * @param {int} limit how many FakeMambers to limit
     */
    getFakeMambers: async (root, { authUserId, treeId, skip, limit }, { FakeMamber }) => {
        const query = {
            $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }, { tree: { $ne: treeId } }],
        };
        const FakeMambersCount = await FakeMamber.find(query).countDocuments();
        const allFakeMambers = await FakeMamber.find(query)
            .populate('author')
            .populate('name')
            .populate('gender')
            .populate('phone')
            .populate('image')
            .populate('tree')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 'desc' });

        return { fakeMambers: allFakeMambers, count: FakeMambersCount };
    },
    /**
     * Gets FakeMambers from followed users
     *
     * @param {string} authorId
     * @param {string} treeId
     * @param {int} skip how many FakeMambers to skip
     * @param {int} limit how many FakeMambers to limit
     */
    /**
     * Gets FakeMambers by id
     *
     * @param {string} id
     */
    getFakeMamber: async (root, { id }, { FakeMamber }) => {
        const fakeMamber = await FakeMamber.findById(id)
            .populate('author')
            .populate('name')
            .populate('gender')
            .populate('phone')
            .populate('image')
            .populate('tree');
        return fakeMamber;
    },
};

const Mutation = {
    /**
     * Creates a new FakeMamber
     *
     * @param {string} name
     * @param {string} gender
     * @param {string} phone
     * @param {string} treeId
     * @param {string} image
     * @param {string} authorId
     */
    createFakeMamber: async (
        root,
        { input: { name, image, gender, phone, authorId, fatherId, motherId,treeId } },
        { FakeMamber, Tree }
    ) => {
        if (!name && !image) {
            throw new Error('FakeMamber name or image is required.');
        }

        let imageUrl, imagePublicId;
        if (image) {
            const { createReadStream } = await image;
            const stream = createReadStream();
            const uploadImage = await uploadToCloudinary(stream, 'FakeMamber');

            if (!uploadImage.secure_url) {
                throw new Error(
                    'Something went wrong while uploading image to Cloudinary'
                );
            }

            imageUrl = uploadImage.secure_url;
            imagePublicId = uploadImage.public_id;
        }

        const newFakeMamber = await new FakeMamber({
            name,
            gender,
            phone,
            image: imageUrl,
            imagePublicId,
            tree: treeId,
            mother: motherId,
            father: fatherId,
            author: authorId,
        }).save();

        await Tree.findOneAndUpdate(
            { _id: treeId },
            { $push: { fakeMambers: newFakeMamber.id } }
        );
        return newFakeMamber;
    },
    /**
     * Deletes a user FakeMamber
     *
     * @param {string} id
     * @param {imagePublicId} id
     */
    deleteFakeMamber: async (
        root,
        { input: { id, imagePublicId } },
        { FakeMamber, Tree, }
    ) => {
        // Remove FakeMamber image from cloudinary, if imagePublicId is present
        if (imagePublicId) {
            const deleteImage = await deleteFromCloudinary(imagePublicId);

            if (deleteImage.result !== 'ok') {
                throw new Error(
                    'Something went wrong while deleting image from Cloudinary'
                );
            }
        }

        // Find FakeMamber and remove it
        const fakeMamber = await FakeMamber.findByIdAndRemove(id);

        await Tree.findOneAndUpdate(
            { _id: treeId },
            { $push: { fakeMambers: fakeMamber.id } }
        );
        return fakeMamber;
    },
};

export default { Query, Mutation };