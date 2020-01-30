import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
    /**
     * Gets PhotoAlbum from followed users
     *
     * @param {string} authorId
     * @param {string} treeId
     * @param {int} skip how many PhotoAlbum to skip
     * @param {int} limit how many PhotoAlbum to limit
     */
    /**
     * Gets PhotoAlbum by id
     *
     * @param {string} id
     */
    getPhotoAlbum: async (root, { id }, { PhotoAlbum }) => {
        const photoAlbum = await PhotoAlbum.findById(id)
            .populate('text')
            .populate('image')
            .populate('tree');
        return photoAlbum;
    },
};

const Mutation = {
    /**
     * Creates a new photoAlbum
     *
     * @param {string} text
     * @param {string} treeId
     * @param {string} memoryId
     * @param {string} image
     * @param {string} authorId
     */
    createPhotoAlbum: async (
        root,
        { input: { text, image, memoryId, authorId, treeId } },
        { PhotoAlbum, User, Tree }
    ) => {
        let imageUrl, imagePublicId;
        if (image) {
            const { createReadStream } = await image;
            const stream = createReadStream();
            const uploadImage = await uploadToCloudinary(stream, 'PhotoAlbum');

            if (!uploadImage.secure_url) {
                throw new Error(
                    'Something went wrong while uploading image to Cloudinary'
                );
            }
            imageUrl = uploadImage.secure_url;
            imagePublicId = uploadImage.public_id;
        }

        const newPhotoAlbum = await new PhotoAlbum({
            text,
            memory: memoryId,
            image: imageUrl,
            imagePublicId,
            tree: treeId,
            author: authorId,
        }).save();

        await User.findOneAndUpdate(
            { _id: authorId },
            { $push: { photoAlbums: newPhotoAlbum.id } }
        );

        await Tree.findOneAndUpdate(
            { _id: treeId },
            { $push: { photoAlbums: newPhotoAlbum.id } }
        );
        return newPhotoAlbum;
    },
    /**
     * Deletes a user photoAlbum
     *
     * @param {string} id
     */
    deletePhotoAlbum: async (
        root,
        { input: { id } },
        { PhotoAlbum, Tree, User }
    ) => {
        // Remove Testimonial image from cloudinary, if imagePublicId is present
        if (imagePublicId) {
          const deleteImage = await deleteFromCloudinary(imagePublicId);
    
          if (deleteImage.result !== 'ok') {
            throw new Error(
              'Something went wrong while deleting image from Cloudinary'
            );
          }
        }

        // Find PhotoAlbum and remove it
        const photoAlbum = await PhotoAlbum.findByIdAndRemove(id);

        // Delete photoAlbum from authors (users) photoAlbums collection
        await User.findOneAndUpdate(
            { _id: photoAlbum.author },
            { $pull: { photoAlbums: photoAlbum.id } }
        );

        await Tree.findOneAndUpdate(
            { _id: treeId },
            { $push: { photoAlbums: photoAlbum.id } }
        );

        return photoAlbum;
    },
};

export default { Query, Mutation };
