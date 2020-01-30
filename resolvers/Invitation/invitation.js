import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
  /**
   * Gets all Invitations
   *
   * @param {string} authUserId
   * @param {string} treeId
   * @param {int} skip how many Invitations to skip
   * @param {int} limit how many Invitations to limit
   */
  getInvitations: async (root, { authUserId, treeId, skip, limit }, { Invitation }) => {
    const query = {
      $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }, { tree: { $ne: treeId } }],
    };
    const invitationsCount = await Invitation.find(query).countDocuments();
    const allInvitations = await Invitation.find(query)
      .populate('id')
      .populate({
        path: 'author',
        populate: [
          { path: 'id' },
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
      .populate({
        path: 'tree',
        populate: [
          { path: 'id' },
          { path: 'treename' },
          { path: 'image' },
        ],
      })
      .populate({
        path: 'group',
        populate: [
          { path: 'id' },
          { path: 'groupname' },
          { path: 'image' },
        ],
      })
      .populate('text')
      .populate('image')
      .populate('dateTo')
      .populate('likes')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { invitations: allInvitations, count: invitationsCount };
  },
  /**
   * Gets invitations from followed users
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many invitations to skip
   * @param {int} limit how many invitations to limit
   */
  /**
   * Gets invitations by id
   *
   * @param {string} id
   */
  getInvitation: async (root, { id }, { Invitation }) => {
    const invitation = await Invitation.findById(id)
      .populate({
        path: 'author',
        populate: [
          { path: 'id' },
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
      .populate({
        path: 'tree',
        populate: [
          { path: 'id' },
          { path: 'treename' },
          { path: 'image' },
        ],
      })
      .populate({
        path: 'group',
        populate: [
          { path: 'id' },
          { path: 'groupname' },
          { path: 'image' },
        ],
      })
      .populate('text')
      .populate('image')
      .populate('dateTo')
      .populate('likes')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      });
    return invitation;
  },
};

const Mutation = {
  /**
   * Creates a new invitation
   *
   * @param {string} text
   * @param {string} treeId
   * @param {string} image
   * @param {string} authorId
   */
  createInvitation: async (
    root,
    { input: { text, image, authorId, treeId, groupId, dateTo } },
    { Invitation, User, Tree, Group }
  ) => {
    if (!text && !image) {
      throw new Error('Invitation text or image is required.');
    }

    let imageUrl, imagePublicId;
    if (image) {
      const { createReadStream } = await image;
      const stream = createReadStream();
      const uploadImage = await uploadToCloudinary(stream, 'invitation');

      if (!uploadImage.secure_url) {
        throw new Error(
          'Something went wrong while uploading image to Cloudinary'
        );
      }

      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }

    const newInvitation = await new Invitation({
      text,
      dateTo,
      image: imageUrl,
      imagePublicId,
      group: groupId,
      tree: treeId,
      author: authorId,
    }).save();

    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { invitations: newInvitation.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { invitations: newInvitation.id } }
    );

    await Group.findOneAndUpdate(
      { _id: groupId },
      { $push: { invitations: newInvitation.id } }
    );
    return newInvitation;
  },
  /**
   * Deletes a user Invitation
   *
   * @param {string} id
   * @param {imagePublicId} id
   */
  deleteInvitation: async (
    root,
    { input: { id, imagePublicId } },
    { Invitation, Tree, User, Like, Comment, Notification }
  ) => {
    // Remove Invitation image from cloudinary, if imagePublicId is present
    if (imagePublicId) {
      const deleteImage = await deleteFromCloudinary(imagePublicId);

      if (deleteImage.result !== 'ok') {
        throw new Error(
          'Something went wrong while deleting image from Cloudinary'
        );
      }
    }

    // Find Invitation and remove it
    const invitation = await Invitation.findByIdAndRemove(id);

    // Delete Invitation from authors (users) Invitations collection
    await User.findOneAndUpdate(
      { _id: invitation.author },
      { $pull: { invitations: invitation.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { invitations: invitation.id } }
    );
    // Delete invitation likes from likes collection
    await Like.find({ invitation: invitation.id }).deleteMany();
    // Delete invitation likes from users collection
    invitation.likes.map(async likeId => {
      await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
    });

    // Delete Invitation comments from comments collection
    await Comment.find({ invitation: invitation.id }).deleteMany();
    // Delete comments from users collection
    invitation.comments.map(async commentId => {
      await User.where({ comments: commentId }).update({
        $pull: { comments: commentId },
      });
    });

    // Find user notification in users collection and remove them
    const userNotifications = await invitationNotification.find({ invitation: invitation.id });

    userNotifications.map(async notification => {
      await User.where({ notifications: notification.id }).update({
        $pull: { invitationNotifications: notification.id },
      });
    });
    // Remove notifications from notifications collection
    await invitationNotification.find({ invitation: invitation.id }).deleteMany();

    return invitation;
  },
};

export default { Query, Mutation };