const Mutation = {
  /**
   * Creates a memory comment
   *
   * @param {string} comment
   * @param {string} author author id
   * @param {string} memoryId
   */
  createMemoryComment: async (
    root,
    { input: { comment, author, authorId, memoryId } },
    { memoryComment, Memory, User }
  ) => {
    const newComment = await new memoryComment({
      comment,
      author: authorId,
      memory: memoryId,
    }).save();

    // Push comment to memory collection
    await Memory.findOneAndUpdate(
      { _id: memoryId },
      { $push: { comments: newComment.id } }
    );
    // Push comment to user collection
    await User.findOneAndUpdate(
      { _id: author },
      { $push: { comments: newComment.id } }
    );

    return newComment;
  },
  /**
   * Deletes a memory comment
   *
   * @param {string} id
   */
  deleteMemoryComment: async (root, { input: { id } }, { memoryComment, User, Memory }) => {
    const comment = await memoryComment.findByIdAndRemove(id);

    // Delete comment from users collection
    await User.findOneAndUpdate(
      { _id: comment.author },
      { $pull: { comments: comment.id } }
    );
    // Delete comment from memorys collection
    await Memory.findOneAndUpdate(
      { _id: comment.memory },
      { $pull: { comments: comment.id } }
    );

    return comment;
  },
};

export default { Mutation };
