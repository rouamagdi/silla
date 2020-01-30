const Mutation = {
  /**
   * Creates a testimonial comment
   *
   * @param {string} comment
   * @param {string} author author id
   * @param {string} testimonialId
   */
  createTestimonialComment: async (
    root,
    { input: { comment, author, authorId, testimonialId } },
    { testimonialComment, Testimonial, User }
  ) => {
    const newComment = await new testimonialComment({
      comment,
      author: authorId,
      testimonial: testimonialId,
    }).save();

    // Push comment to testimonial collection
    await Testimonial.findOneAndUpdate(
      { _id: testimonialId },
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
   * Deletes a testimonial comment
   *
   * @param {string} id
   */
  deleteTestimonialComment: async (root, { input: { id } }, { testimonialComment, User, Testimonial }) => {
    const comment = await testimonialComment.findByIdAndRemove(id);

    // Delete comment from users collection
    await User.findOneAndUpdate(
      { _id: comment.author },
      { $pull: { comments: comment.id } }
    );
    // Delete comment from testimonials collection
    await Testimonial.findOneAndUpdate(
      { _id: comment.testimonial },
      { $pull: { comments: comment.id } }
    );

    return comment;
  },
};

export default { Mutation };
