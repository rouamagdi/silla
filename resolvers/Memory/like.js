const Mutation = {
  /**
   * Creates a like for memory
   *
   * @param {string} authorId
   * @param {string} memoryId
   */
  createMemoryLike: async (
    root,
    { input: { authorId, memoryId } },
    { memoryLike, Memory, User }
  ) => {
    const like = await new memoryLike({ author: authorId, memory: memoryId }).save();

    // Push like to memory collection
    await Memory.findOneAndUpdate({ _id: memoryId }, { $push: { likes: like.id } });
    // Push like to user collection
    await User.findOneAndUpdate({ _id: authorId }, { $push: { likes: like.id } });

    return like;
  },
  /**
   * Deletes a memory like
   *
   * @param {string} id
   */
  deleteMemoryLike: async (root, { input: { id } }, { memoryLike, User, Memory }) => {
    const like = await memoryLike.findByIdAndRemove(id);

    // Delete like from users collection
    await User.findOneAndUpdate(
      { _id: like.user },
      { $pull: { likes: like.id } }
    );
    // Delete like from Memorys collection
    await Memory.findOneAndUpdate(
      { _id: like.memory },
      { $pull: { likes: like.id } }
    );

    return like;
  },
};

export default { Mutation };
