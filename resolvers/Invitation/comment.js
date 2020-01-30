const Mutation = {
  /**
   * Creates a invitation comment
   *
   * @param {string} comment
   * @param {string} author author id
   * @param {string} invitationId
   */
  createInvitationComment: async (
    root,
    { input: { comment, author, authorId, invitationId } },
    { invitationComment, Invitation, User }
  ) => {
    const newComment = await new invitationComment({
      comment,
      author: authorId,
      invitation: invitationId,
    }).save();

    // Push comment to invitation collection
    await Invitation.findOneAndUpdate(
      { _id: invitationId },
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
   * Deletes a invitation comment
   *
   * @param {string} id
   */
  deleteInvitationComment: async (root, { input: { id } }, { invitationComment, User, Invitation }) => {
    const comment = await invitationComment.findByIdAndRemove(id);

    // Delete comment from users collection
    await User.findOneAndUpdate(
      { _id: comment.author },
      { $pull: { comments: comment.id } }
    );
    // Delete comment from invitations collection
    await Invitation.findOneAndUpdate(
      { _id: comment.invitation },
      { $pull: { comments: comment.id } }
    );

    return comment;
  },
};

export default { Mutation };
