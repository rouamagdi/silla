const Query = {
  /**
   * Gets notifications for specific user in specific tree
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many notifications to skip
   * @param {int} limit how many notifications to limit
   */
  getMemoryNotifications: async (
    root,
    { authorId, treeId, skip, limit },
    { memoryNotification }
  ) => {
    const query = { author: authorId, tree: treeId };
    const count = await memoryNotification.where(query).countDocuments();
    const notifications = await memoryNotification.where(query)
      .populate('tree')
      .populate('author')
      .populate('memory')
      .populate({ path: 'comment', populate: { path: 'memory' } })
      .populate({ path: 'like', populate: { path: 'memory' } })
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
   * @param {string} memoryId
   * @param {string} notificationType
   * @param {string} notificationTypeId
   */
  createMemoryNotification: async (
    root,
    {
      input: { authorId, treeId, memoryId, notificationType, notificationTypeId },
    },
    { memoryNotification, User }
  ) => {
    const newMemoryNotification = await new memoryNotification({
      author: authorId,
      tree: treeId,
      memory: memoryId,
      [notificationType.toLowerCase()]: notificationTypeId,
    }).save();

    // Push notification to user collection
    await User.findOneAndUpdate(
      { _id: authorId, tree: treeId },
      { $push: { memoryNotifications: newMemoryNotification.id } }
    );

    return newMemoryNotification;
  },
  /**
   * Deletes a notification
   *
   * @param {string} id
   */
  deleteMemoryNotification: async (
    root,
    { input: { id } },
    { memoryNotification, User }
  ) => {
    const notification = await memoryNotification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { memoryNotifications: notification.id } }
    );

    return notification;
  },
  /**
   * Updates notification seen values for user
   *
   * @param {string} authorId
   */
  updateMemoryNotificationSeen: async (
    root,
    { input: { authorId, treeId } },
    { memoryNotification }
  ) => {
    try {
      await memoryNotification.update(
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