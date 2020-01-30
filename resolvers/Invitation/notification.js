const Query = {
  /**
   * Gets notifications for specific user in specific tree
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many notifications to skip
   * @param {int} limit how many notifications to limit
   */
  getInvitationNotifications: async (
    root,
    { authorId, treeId, skip, limit },
    { invitationNotification }
  ) => {
    const query = { author: authorId, tree: treeId };
    const count = await invitationNotification.where(query).countDocuments();
    const notifications = await invitationNotification.where(query)
      .populate('tree')
      .populate('author')
      .populate('invitation')
      .populate({ path: 'comment', populate: { path: 'invitation' } })
      .populate({ path: 'like', populate: { path: 'invitation' } })
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
   * @param {string} invitationId
   * @param {string} notificationType
   * @param {string} notificationTypeId
   */
  createInvitationNotification: async (
    root,
    {
      input: { authorId, treeId, invitationId, notificationType, notificationTypeId },
    },
    { invitationNotification, User }
  ) => {
    const newInvitationNotification = await new invitationNotification({
      author: authorId,
      tree: treeId,
      invitation: invitationId,
      [notificationType.toLowerCase()]: notificationTypeId,
    }).save();

    // Push notification to user collection
    await User.findOneAndUpdate(
      { _id: authorId, tree: treeId },
      { $push: { invitationNotifications: newInvitationNotification.id } }
    );

    return newInvitationNotification;
  },
  /**
   * Deletes a notification
   *
   * @param {string} id
   */
  deleteInvitationNotification: async (
    root,
    { input: { id } },
    { invitationNotification, User }
  ) => {
    const notification = await invitationNotification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { invitationNotifications: notification.id } }
    );

    return notification;
  },
  /**
   * Updates notification seen values for user
   *
   * @param {string} authorId
   */
  updateInvitationNotificationSeen: async (
    root,
    { input: { authorId, treeId } },
    { invitationNotification }
  ) => {
    try {
      await invitationNotification.update(
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