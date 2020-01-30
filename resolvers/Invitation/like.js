const Mutation = {
  /**
   * Creates a like for invitation
   *
   * @param {string} authorId
   * @param {string} invitationId
   */
  createInvitationLike: async (
    root,
    { input: { authorId, invitationId } },
    { invitationLike, Invitation, User }
  ) => {
    const like = await new invitationLike({ author: authorId, invitation: invitationId }).save();

    // Push like to invitation collection
    await Invitation.findOneAndUpdate({ _id: invitationId }, { $push: { likes: like.id } });
    // Push like to user collection
    await User.findOneAndUpdate({ _id: invitationId }, { $push: { likes: like.id } });

    return like;
  },
  /**
   * Deletes a invitation like
   *
   * @param {string} id
   */
  deleteInvitationLike: async (root, { input: { id } }, { invitationLike, User, Invitation }) => {
    const like = await invitationLike.findByIdAndRemove(id);

    // Delete like from users collection
    await User.findOneAndUpdate(
      { _id: like.user },
      { $pull: { likes: like.id } }
    );
    // Delete like from invitations collection
    await Invitation.findOneAndUpdate(
      { _id: like.invitation },
      { $pull: { likes: like.id } }
    );

    return like;
  },
};

export default { Mutation };
