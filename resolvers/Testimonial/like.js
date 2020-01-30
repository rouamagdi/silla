const Mutation = {
  /**
   * Creates a like for testimonial
   *
   * @param {string} authorId
   * @param {string} testimonialId
   */
  createTestimonialLike: async (
    root,
    { input: { authorId, testimonialId } },
    { Like, Testimonial, User }
  ) => {
    const like = await new Like({ author: authorId, testimonial: testimonialId }).save();

    // Push like to testimonial collection
    await Testimonial.findOneAndUpdate({ _id: testimonialId }, { $push: { likes: like.id } });
    // Push like to user collection
    await User.findOneAndUpdate({ _id: authorId }, { $push: { likes: like.id } });

    return like;
  },
  /**
   * Deletes a testimonial like
   *
   * @param {string} id
   */
  deleteTestimonialLike: async (root, { input: { id } }, { Like, User, Testimonial }) => {
    const like = await Like.findByIdAndRemove(id);

    // Delete like from users collection
    await User.findOneAndUpdate(
      { _id: like.user },
      { $pull: { likes: like.id } }
    );
    // Delete like from testimonials collection
    await Testimonial.findOneAndUpdate(
      { _id: like.testimonial },
      { $pull: { likes: like.id } }
    );

    return like;
  },
};

export default { Mutation };
