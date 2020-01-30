const Mutation = {
  /**
   * Creates a post comment
   *
   * @param {string} comment
   * @param {string} author author id
   * @param {string} postId
   */
  createPostComment: async (
    root,
    { input: { comment, author, authorId, postId } },
    { postComment, Post, User }
  ) => {
    const newComment = await new postComment({
      comment,
      author: authorId,
      post: postId,
    }).save();

    // Push comment to post collection
    await Post.findOneAndUpdate(
      { _id: postId },
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
   * Deletes a post comment
   *
   * @param {string} id
   */
  deletePostComment: async (root, { input: { id } }, { postComment, User, Post }) => {
    const comment = await postComment.findByIdAndRemove(id);

    // Delete comment from users collection
    await User.findOneAndUpdate(
      { _id: comment.author },
      { $pull: { comments: comment.id } }
    );
    // Delete comment from posts collection
    await Post.findOneAndUpdate(
      { _id: comment.post },
      { $pull: { comments: comment.id } }
    );

    return comment;
  },
};

export default { Mutation };
