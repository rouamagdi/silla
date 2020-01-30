import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';


const Query = {
  /**
   * Gets all Testimonials
   *
   * @param {string} authUserId
   * @param {string} treeId
   * @param {int} skip how many Testimonials to skip
   * @param {int} limit how many Testimonials to limit
   */
  getTestimonials: async (root, { authUserId, treeId, skip, limit }, { Testimonial }) => {
    const query = {
      $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }, { tree: { $ne: treeId } }],
    };
    const TestimonialsCount = await Testimonial.find(query).countDocuments();
    const allTestimonials = await Testimonial.find(query)
      .populate({
        path: 'author',
        populate: [
          {
            path: 'notifications',
            populate: [
              { path: 'author' },
              { path: 'like' },
              { path: 'comment' },
            ],
          },
        ],
      })
      .populate('question')
      .populate('image')
      .populate('tree')
      .populate('likes')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { testimonials: allTestimonials, count: TestimonialsCount };
  },
  /**
   * Gets Testimonials from followed users
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many Testimonials to skip
   * @param {int} limit how many Testimonials to limit
   */
  /**
   * Gets Testimonials by id
   *
   * @param {string} id
   */
  getTestimonial: async (root, { id }, { Testimonial }) => {
    const testimonial = await Testimonial.findById(id)
      .populate({
        path: 'author',
        populate: [
          {
            path: 'notifications',
            populate: [
              { path: 'author' },
              { path: 'like' },
              { path: 'comment' },
            ],
          },
        ],
      })
      .populate('question')
      .populate('options')
      .populate('voted')
      .populate('image')
      .populate('tree')
      .populate('likes')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      });
    return testimonial;
  },
};

const Mutation = {
  /**
   * Creates a new Testimonial
   *
   * @param {string} text
   * @param {string} treeId
   * @param {string} image
   * @param {string} authorId
   */
  createTestimonial: async (
    root,
    { input: { question, option, votes, authorId, treeId, groupId } },
    { Testimonial, User, Tree, Group }
  ) => {
    if (!question && !options) {
      throw new Error('Testimonial question and options is required.');
    }

    const newTestimonial = await new Testimonial({
      question,
      options: option[{option, votes}],
      tree: treeId,
      group: groupId,
      author: authorId
    }).save();

    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { testimonials: newTestimonial.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { testimonials: newTestimonial.id } }
    );

    await Group.findOneAndUpdate(
      { _id: groupId },
      { $push: { testimonials: newTestimonial.id } }
    );
    return newTestimonial;
  },
  /**
   * create votes
   *
   * @param {string} id
   * @param {imagePublicId} id
   */
  voteOnTestimonial: async (
    root,
    { input: { authorId, testimonialId } },
    { Testimonial }
  ) => {
    const { answer } = {};
      if (answer) {
        const testimonial = await Testimonial.findById(testimonialId);
        if (!testimonial) throw new Error('No testimonial found');

        const vote = testimonial.options.map(
          option =>
            option.option === answer
              ? {
                option: option.option,
                _id: option._id,
                votes: option.votes + 1,
              }
              : option,
        );

        console.log('VOTE: USERID ', authorId);
        console.log('VOTE: testimonial.voted ', testimonial.voted);
        console.log(
          'VOTE: vote filter',
          testimonial.voted.filter(user => user.toString() === authorId).length,
        );

        if (testimonial.voted.filter(user => user.toString() === authorId).length <= 0) {
          testimonial.voted.push(authorId);
          testimonial.options = vote;
          await testimonial.save();

          return testimonial;
        } else {
          throw new Error('Already voted');
        }
      } else {
        throw new Error('No Answer Provided');
      }
  },
  /**
   * Deletes a user Testimonial
   *
   * @param {string} id
   * @param {imagePublicId} id
   */
  deleteTestimonial: async (
    root,
    { input: { id, imagePublicId } },
    { Testimonial, Tree, User, Like, Comment, testimonialNotification }
  ) => {
    // Remove Testimonial image from cloudinary, if imagePublicId is present
    if (imagePublicId) {
      const deleteImage = await deleteFromCloudinary(imagePublicId);

      if (deleteImage.result !== 'ok') {
        throw new Error(
          'Something went wrong while deleting image from Cloudinary'
        );
      }
    }

    // Find Testimonial and remove it
    const testimonial = await Testimonial.findByIdAndRemove(id);

    // Delete Testimonial from authors (users) Testimonials collection
    await User.findOneAndUpdate(
      { _id: testimonial.author },
      { $pull: { testimonials: testimonial.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { testimonials: testimonial.id } }
    );
    // Delete Testimonial likes from likes collection
    await Like.find({ testimonial: testimonial.id }).deleteMany();
    // Delete Testimonial likes from users collection
    testimonial.likes.map(async likeId => {
      await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
    });

    // Delete Testimonial comments from comments collection
    await Comment.find({ testimonial: testimonial.id }).deleteMany();
    // Delete comments from users collection
    testimonial.comments.map(async commentId => {
      await User.where({ comments: commentId }).update({
        $pull: { comments: commentId },
      });
    });

    // Find user notification in users collection and remove them
    const userNotifications = await testimonialNotification.find({ testimonial: testimonial.id });

    userNotifications.map(async notification => {
      await User.where({ testimonialNotifications: notification.id }).update({
        $pull: { testimonialNotifications: notification.id },
      });
    });
    // Remove notifications from notifications collection
    await Notification.find({ testimonial: testimonial.id }).deleteMany();

    return testimonial;
  },
};

export default { Query, Mutation };