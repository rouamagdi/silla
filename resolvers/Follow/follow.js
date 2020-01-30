const Mutation = {
  /**
   * Creates a following/follower relationship between users
   *
   * @param {string} authorId
   * @param {string} followerId
   */
  createTreeFollow: async (
    root,
    { input: { authorId,  treeId } },
    { Follow, User, Tree }
  ) => {
    const follow = await new Follow({
      author: authorId,
      tree: treeId
    }).save();

    // Push follower/following to user collection
    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { followers: follow.id } }
    );
    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { following: follow.id } }
    );

    return follow;
  },
  /**
   * Deletes a following/follower relationship between users
   *
   * @param {string} id follow id
   */
  deleteTreeFollow: async (root, { input: { id } }, { Follow, User, Tree }) => {
    const follow = await Follow.findByIdAndRemove(id);

    // Delete follow from users collection
    await User.findOneAndUpdate(
      { _id: follow.user },
      { $pull: { followers: follow.id } }
    );
    await Tree.findOneAndUpdate(
      { _id: follow.tree },
      { $pull: { following: follow.id } }
    );

    return follow;
  },
/**
   * Creates a following/follower relationship between users
   *
   * @param {string} authorId
   * @param {string} followerId
   */
  createGroupFollow: async (
    root,
    { input: { authorId,  groupId } },
    { Follow, User, Group }
  ) => {
    const follow = await new Follow({
      author: authorId,
      group: groupId
    }).save();

    // Push follower/following to user collection
    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { followers: follow.id } }
    );
    await Group.findOneAndUpdate(
      { _id: groupId },
      { $push: { following: follow.id } }
    );

    return follow;
  },
  /**
   * Deletes a following/follower relationship between users
   *
   * @param {string} id follow id
   */
  deleteGroupFollow: async (root, { input: { id } }, { Follow, User, Group }) => {
    const follow = await Follow.findByIdAndRemove(id);

    // Delete follow from users collection
    await User.findOneAndUpdate(
      { _id: follow.user },
      { $pull: { followers: follow.id } }
    );
    await Group.findOneAndUpdate(
      { _id: follow.group },
      { $pull: { following: follow.id } }
    );

    return follow;
  },
};

export default { Mutation };
