const Query = {
  /**
   * Gets notifications for specific user in specific tree
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many notifications to skip
   * @param {int} limit how many notifications to limit
   */
  getChatNotifications: async (
    root,
    { authorId, treeId, skip, limit },
    { chatNotification }
  ) => {
    const query = { author: authorId, tree: treeId };
    const count = await chatNotification.where(query).countDocuments();
    const notifications = await chatNotification.where(query)
      .populate('tree')
      .populate('author')
      .populate('user')
      .populate('chat')
      .populate({ path: 'message', populate: { path: 'chat' } })
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
   * @param {string} chatId
   * @param {string} notificationType
   * @param {string} notificationTypeId
   */
  createChatNotification: async (
    root,
    {
      input: { userId, authorId, treeId, chatId, notificationType, notificationTypeId },
    },
    { chatNotification, User, Tree }
  ) => {
    const newChatNotification = await new chatNotification({
      author: authorId,
      tree: treeId,
      chat: chatId,
      [notificationType.toLowerCase()]: notificationTypeId,
    }).save();

    // Push notification to user collection
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { chatNotifications: newChatNotification.id } }
    );
    // Push notification to tree collection
    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { chatNotifications: newChatNotification.id } }
    );

    return newChatNotification;
  },
  /**
   * Deletes a notification
   *
   * @param {string} id
   */
  deleteChatNotification: async (
    root,
    { input: { id } },
    { chatNotification, User }
  ) => {
    const notification = await chatNotification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { chatNotifications: notification.id } }
    );

    return notification;
  },
  /**
   * Updates notification seen values for user
   *
   * @param {string} authorId
   */
  updateChatNotificationSeen: async (
    root,
    { input: { authorId, treeId } },
    { chatNotification }
  ) => {
    try {
      await chatNotification.update(
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
