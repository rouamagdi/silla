import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
  /**
   * Gets all Donations
   *
   * @param {string} authUserId
   * @param {string} treeId
   * @param {int} skip how many donations to skip
   * @param {int} limit how many donations to limit
   */
  getDonations: async (root, { authUserId, treeId, skip, limit }, { Donation }) => {
    const query = {
      $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }, { tree: { $ne: treeId } }],
    };
    const donationsCount = await Donation.find(query).countDocuments();
    const allDonations = await Donation.find(query)
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

    return { donations: allDonations, count: donationsCount };
  },
  /**
   * Gets donatios from followed users
   *
   * @param {string} userId
   * @param {string} treeId
   * @param {int} skip how many donatios to skip
   * @param {int} limit how many donatios to limit
   */
  /**
   * Gets donations by id
   *
   * @param {string} id
   */
  getDonation: async (root, { id }, { Donation }) => {
    const donation = await Donation.findById(id)
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
    .populate('mount')
    .populate('dateTo')
    .populate('likes')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'desc' } },
      populate: { path: 'author' },
    });
    return donation;
  },
};

const Mutation = {
  /**
   * Creates a new donation
   *
   * @param {string} text
   * @param {string} treeId
   * @param {string} image
   * @param {string} authorId
   */
  createDonation: async (
    root,
    { input: { text, image, mount, dateTo, count, authorId, treeId, groupId } },
    { Donation, User, Tree }
  ) => {
    if (!text && !image) {
      throw new Error('Donation text or image is required.');
    }

    let imageUrl, imagePublicId;
    if (image) {
      const { createReadStream } = await image;
      const stream = createReadStream();
      const uploadImage = await uploadToCloudinary(stream, 'donation');

      if (!uploadImage.secure_url) {
        throw new Error(
          'Something went wrong while uploading image to Cloudinary'
        );
      }

      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }

    const newDonation = await new Donation({
      text,
      mount,
      count,
      dateTo,
      image: imageUrl,
      imagePublicId,
      tree: treeId,
      group: groupId,
      author: authorId,
    }).save();

    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { donations: newDonation.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { donations: newDonation.id } }
    );
    return newDonation;
  },
  /**
   * Deletes a user donation
   *
   * @param {string} id
   * @param {imagePublicId} id
   */
  deleteDonation: async (
    root,
    { input: { id, imagePublicId } },
    { Donation, Tree, User, Like, Comment, donationNotification }
  ) => {
    // Remove donation image from cloudinary, if imagePublicId is present
    if (imagePublicId) {
      const deleteImage = await deleteFromCloudinary(imagePublicId);

      if (deleteImage.result !== 'ok') {
        throw new Error(
          'Something went wrong while deleting image from Cloudinary'
        );
      }
    }

    // Find donation and remove it
    const donation = await Donation.findByIdAndRemove(id);

    // Delete donation from authors (users) donations collection
    await User.findOneAndUpdate(
      { _id: donation.author },
      { $pull: { donations: donation.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { donations: donation.id } }
    );
    // Delete donation likes from likes collection
    await Like.find({ donation: donation.id }).deleteMany();
    // Delete donation likes from users collection
    donation.likes.map(async likeId => {
      await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
    });

    // Delete donation comments from comments collection
    await Comment.find({ donation: donation.id }).deleteMany();
    // Delete comments from users collection
    donation.comments.map(async commentId => {
      await User.where({ comments: commentId }).update({
        $pull: { comments: commentId },
      });
    });

    // Find user notification in users collection and remove them
    const userNotifications = await donationNotification.find({ donation: donation.id });

    userNotifications.map(async notification => {
      await User.where({ donationNotifications: notification.id }).update({
        $pull: { donationNotification: notification.id },
      });
    });
    // Remove notifications from notifications collection
    await donationNotification.find({ donation: donation.id }).deleteMany();

    return donation;
  },
};

export default { Query, Mutation };