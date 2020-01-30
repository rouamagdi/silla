const Query = {
  /**
   * Gets notifications for specific user in specific tree
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many notifications to skip
   * @param {int} limit how many notifications to limit
   */
  getPostNotifications: async (
    root,
    { authorId, treeId, skip, limit },
    { postNotification }
  ) => {
    const query = { author: authorId, tree: treeId };
    const count = await postNotification.where(query).countDocuments();
    const notifications = await postNotification.where(query)
      .populate('tree')
      .populate('author')
      .populate('user')
      .populate('post')
      .populate({ path: 'comment', populate: { path: 'post' } })
      .populate({ path: 'like', populate: { path: 'post' } })
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
   * @param {string} postId
   * @param {string} notificationType
   * @param {string} notificationTypeId
   */
  createPostNotification: async (
    root,
    {
      input: { authorId, treeId, postId, notificationType, notificationTypeId },
    },
    { postNotification, User }
  ) => {
    const newPostNotification = await new postNotification({
      author: authorId,
      tree: treeId,
      post: postId,
      [notificationType.toLowerCase()]: notificationTypeId,
    }).save();

    // Push notification to user collection
    await User.findOneAndUpdate(
      { _id: authorId, tree: treeId },
      { $push: { postNotifications: newPostNotification.id } }
    );

    return newPostNotification;
  },
  /**
   * Deletes a notification
   *
   * @param {string} id
   */
  deletePostNotification: async (
    root,
    { input: { id } },
    { postNotification, User }
  ) => {
    const notification = await postNotification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { postNotifications: notification.id } }
    );

    return notification;
  },
  /**
   * Updates notification seen values for user
   *
   * @param {string} authorId
   */
  updatePostNotificationSeen: async (
    root,
    { input: { authorId, treeId } },
    { postNotification }
  ) => {
    try {
      await postNotification.update(
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