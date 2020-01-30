const Query = {
  /**
   * Gets notifications for specific user in specific tree
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many notifications to skip
   * @param {int} limit how many notifications to limit
   */
  getDonationNotifications: async (
    root,
    { authorId, treeId, skip, limit },
    { donationNotification }
  ) => {
    const query = { author: authorId, tree: treeId };
    const count = await donationNotification.where(query).countDocuments();
    const notifications = await donationNotification.where(query)
      .populate('tree')
      .populate('author')
      .populate('user')
      .populate('donation')
      .populate({ path: 'comment', populate: { path: 'donation' } })
      .populate({ path: 'like', populate: { path: 'donation' } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { notifications, count };
  },
};

const Mutation = {
  /**
   * Creates a new notification for user
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {string} donationId
   * @param {string} notificationType
   * @param {string} notificationTypeId
   */
  createDonationNotification: async (
    root,
    {
      input: {  authorId, treeId, donationId, notificationType, notificationTypeId },
    },
    { donationNotification, User, Tree }
  ) => {
    const newDonationNotification = await new donationNotification({
      author: authorId,
      tree: treeId,
      donation: donationId,
      [notificationType.toLowerCase()]: notificationTypeId,
    }).save();

    // Push notification to user collection
    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { donationNotifications: newDonationNotification.id } }
    );
    // Push notification to tree collection
    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { donationNotifications: newDonationNotification.id } }
    );

    return newDonationNotification;
  },
  /**
   * Deletes a notification
   *
   * @param {string} id
   */
  deleteDonationNotification: async (
    root,
    { input: { id } },
    { donationNotification, User }
  ) => {
    const notification = await donationNotification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { donationNotifications: notification.id } }
    );

    return notification;
  },
  /**
   * Updates notification seen values for user
   *
   * @param {string} authorId
   */
  updateDonationNotificationSeen: async (
    root,
    { input: { authorId, treeId } },
    { donationNotification }
  ) => {
    try {
      await donationNotification.update(
        { author: authorId, tree: treeId, seen: false },
        { seen: true },
        { multi: true }
      );

      return true;
    } catch (e) {
      return false;
    }
  },
};

export default { Query, Mutation };
