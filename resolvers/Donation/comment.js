const Mutation = {
  /**
   * Creates a Donation comment
   *
   * @param {string} comment
   * @param {string} author author id
   * @param {string} donationId
   */
  createDonationComment: async (
    root,
    { input: { comment, author, authorId,donationId } },
    { donationComment, Donation, User }
  ) => {
    const newComment = await new donationComment({
      comment,
      author: authorId,
      donation: donationId,
    }).save();

    // Push comment to donation collection
    await Donation.findOneAndUpdate(
      { _id: donationId },
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
   * Deletes a donation comment
   *
   * @param {string} id
   */
  deleteDonationComment: async (root, { input: { id } }, { donationComment, User, Donation }) => {
    const comment = await donationComment.findByIdAndRemove(id);

    // Delete comment from users collection
    await User.findOneAndUpdate(
      { _id: comment.author },
      { $pull: { comments: comment.id } }
    );
    // Delete comment from donations collection
    await Donation.findOneAndUpdate(
      { _id: comment.donation },
      { $pull: { comments: comment.id } }
    );

    return comment;
  },
};

export default { Mutation };
