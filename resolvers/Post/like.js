const Mutation = {
  /**
   * Creates a like for post
   *
   * @param {string} authorId
   * @param {string} postId
   */
  createPostLike: async (
    root,
    { input: { authorId, postId } },
    { postLike, Post, User }
  ) => {
    const like = await new postLike({ author: authorId, post: postId }).save();

    // Push like to post collection
    await Post.findOneAndUpdate({ _id: postId }, { $push: { likes: like.id } });
    // Push like to user collection
    await User.findOneAndUpdate({ _id: authorId }, { $push: { likes: like.id } });

    return like;
  },
  /**
   * Deletes a post like
   *
   * @param {string} id
   */
  deletePostLike: async (root, { input: { id } }, { postLike, User, Post }) => {
    const like = await postLike.findByIdAndRemove(id);

    // Delete like from users collection
    await User.findOneAndUpdate(
      { _id: like.user },
      { $pull: { likes: like.id } }
    );
    // Delete like from posts collection
    await Post.findOneAndUpdate(
      { _id: like.post },
      { $pull: { likes: like.id } }
    );

    return like;
  },
};

export default { Mutation };
