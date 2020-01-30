const Mutation = {
  /**
   * Creates a like for donation
   *
   * @param {string} authorId
   * @param {string} donationId
   */
  createDonationLike: async (
    root,
    { input: { authorId, donationId } },
    { donationLike, Donation, User }
  ) => {
    const like = await new donationLike({ author: authorId, donation: donationId }).save();

    // Push like to donation collection
    await Donation.findOneAndUpdate({ _id: donationId }, { $push: { likes: like.id } });
    // Push like to user collection
    await User.findOneAndUpdate({ _id: authorId }, { $push: { likes: like.id } });

    return like;
  },
  /**
   * Deletes a donation like
   *
   * @param {string} id
   */
  deleteDonationLike: async (root, { input: { id } }, { donationLike, User, Donation }) => {
    const like = await donationLike.findByIdAndRemove(id);

    // Delete like from users collection
    await User.findOneAndUpdate(
      { _id: like.user },
      { $pull: { likes: like.id } }
    );
    // Delete like from donations collection
    await Donation.findOneAndUpdate(
      { _id: like.donation },
      { $pull: { likes: like.id } }
    );

    return like;
  },
};

export default { Mutation };
