const Query = {
  /**
   * Gets notifications for specific user in specific tree
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many notifications to skip
   * @param {int} limit how many notifications to limit
   */
  getTestimonialNotifications: async (
    root,
    { authorId, treeId, skip, limit },
    { Notification }
  ) => {
    const query = { author: authorId, tree: treeId };
    const count = await Notification.where(query).countDocuments();
    const notifications = await Notification.where(query)
      .populate('tree')
      .populate('author')
      .populate('user')
      .populate('testimonial')
      .populate({ path: 'comment', populate: { path: 'testimonial' } })
      .populate({ path: 'like', populate: { path: 'testimonial' } })
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
   * @param {string} testimonialId
   * @param {string} notificationType
   * @param {string} notificationTypeId
   */
  createTestimonialNotification: async (
    root,
    {
      input: { authorId, treeId, testimonialId, notificationType, notificationTypeId },
    },
    { testimonialNotification, User }
  ) => {
    const newTestimonialNotification = await new testimonialNotification({
      author: authorId,
      tree: treeId,
      testimonial: testimonialId,
      [notificationType.toLowerCase()]: notificationTypeId,
    }).save();

    // Push notification to user collection
    await User.findOneAndUpdate(
      { _id: authorId, tree: treeId },
      { $push: { testimonialNotifications: newTestimonialNotification.id } }
    );

    return newTestimonialNotification;
  },
  /**
   * Deletes a notification
   *
   * @param {string} id
   */
  deleteTestimonialNotification: async (
    root,
    { input: { id } },
    { testimonialNotification, User }
  ) => {
    const notification = await testimonialNotification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { testimonialNotifications: notification.id } }
    );

    return notification;
  },
  /**
   * Updates notification seen values for user
   *
   * @param {string} authorId
   */
  updateTestimonialNotificationSeen: async (
    root,
    { input: { authorId, treeId } },
    { testimonialNotification }
  ) => {
    try {
      await testimonialNotification.update(
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
