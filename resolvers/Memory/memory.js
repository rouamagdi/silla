import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
  /**
   * Gets all Memorys
   *
   * @param {string} authUserId
   * @param {int} skip how many Memorys to skip
   * @param {int} limit how many Memorys to limit
   */
  getMemory: async (root, { authUserId, skip, limit }, { Memory }) => {
    const query = {
      $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }],
    };
    const MemorysCount = await Memory.find(query).countDocuments();
    const allMemorys = await Memory.find(query)
    .populate({
        path: 'author',
        populate: [
          {
            path: 'notifications',
            populate: [
              { path: 'author' },
              { path: 'like' },
              { path: 'comment' },
            ],
          },
        ],
      })
      .populate('text')
      .populate('image')
      .populate('tree')
      .populate('likes')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { memorys: allMemorys, count: MemorysCount };
  },
  /**
   * Gets Memorys from followed users
   *
   * @param {string} userId
   * @param {int} skip how many Memorys to skip
   * @param {int} limit how many Memorys to limit
   */
  /**
   * Gets Memorys by id
   *
   * @param {string} id
   */
  getMemory: async (root, { id }, { Memory }) => {
    const memory = await Memory.findById(id)
    .populate({
      path: 'author',
      populate: [
        {
          path: 'notifications',
          populate: [
            { path: 'author' },
            { path: 'like' },
            { path: 'comment' },
          ],
        },
      ],
    })
    .populate('text')
    .populate('image')
    .populate('tree')
    .populate('count')
    .populate('dateTo')
    .populate('likes')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'desc' } },
      populate: { path: 'author' },
    });
    return memory;
  },
};

const Mutation = {
  /**
   * Creates a new memory
   *
   * @param {string} text
   * @param {string} image
   * @param {string} authorId
   */
  createMemory: async (
    root,
    { input: { text, image, authorId, dateto } },
    { Memory, User}
  ) => {
    if (!text && !image) {
      throw new Error('Memory text or image is required.');
    }

    let imageUrl, imagePublicId;
    if (image) {
      const { createReadStream } = await image;
      const stream = createReadStream();
      const uploadImage = await uploadToCloudinary(stream, 'memory');

      if (!uploadImage.secure_url) {
        throw new Error(
          'Something went wrong while uploading image to Cloudinary'
        );
      }

      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }

    const newMemory = await new Memory({
      text,
      image: imageUrl,
      dateto,
      imagePublicId,
      author: authorId,
    }).save();

    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { memorys: newMemory.id } }
    );

    return newMemory;
  },
  /**
   * Deletes a user Memory
   *
   * @param {string} id
   * @param {imagePublicId} id
   */
  deleteMemory: async (
    root,
    { input: { id, imagePublicId } },
    { Memory, Tree, User, Like, Comment, memoryNotification }
  ) => {
    // Remove Memory image from cloudinary, if imagePublicId is present
    if (imagePublicId) {
      const deleteImage = await deleteFromCloudinary(imagePublicId);

      if (deleteImage.result !== 'ok') {
        throw new Error(
          'Something went wrong while deleting image from Cloudinary'
        );
      }
    }

    // Find Memory and remove it
    const memory = await Memory.findByIdAndRemove(id);

    // Delete Memory from authors (users) Memorys collection
    await User.findOneAndUpdate(
      { _id: memory.author },
      { $pull: { memorys: memory.id } }
    );

    // Delete Memory likes from likes collection
    await Like.find({ memory: memory.id }).deleteMany();
    // Delete Memory likes from users collection
    memory.likes.map(async likeId => {
      await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
    });

    // Delete Memory comments from comments collection
    await Comment.find({ memory: memory.id }).deleteMany();
    // Delete comments from users collection
    memory.comments.map(async commentId => {
      await User.where({ comments: commentId }).update({
        $pull: { comments: commentId },
      });
    });

    // Find user notification in users collection and remove them
    const userNotifications = await memoryNotification.find({ memory: memory.id });

    userNotifications.map(async notification => {
      await User.where({ memoryNotifications: notification.id }).update({
        $pull: { memoryNotifications: notification.id },
      });
    });
    // Remove notifications from notifications collection
    await memoryNotification.find({ memory: memory.id }).deleteMany();

    return memory;
  },
};

export default { Query, Mutation };