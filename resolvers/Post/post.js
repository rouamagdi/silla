import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const Query = {
  /**
   * Gets all Posts
   *
   * @param {string} authUserId
   * @param {string} treeId
   * @param {int} skip how many Posts to skip
   * @param {int} limit how many Posts to limit
   */
  getPosts: async (root, { authUserId, treeId, skip, limit }, { Post }) => {
    const query = {
      $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }, { tree: { $ne: treeId } }],
    };
    const PostsCount = await Post.find(query).countDocuments();
    const allPosts = await Post.find(query)
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
      .populate('text')
      .populate('image')
      .populate('tree')
      .populate('likes')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      });

    return { posts: allPosts, count: PostsCount };
  },
  /**
   * Gets Posts from followed users
   *
   * @param {string} authorId
   * @param {string} treeId
   * @param {int} skip how many Posts to skip
   * @param {int} limit how many Posts to limit
   */
  /**
   * Gets Posts by id
   *
   * @param {string} id
   */
  getPost: async (root, { id }, { Post }) => {
    const post = await Post.findById(id)
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
    .populate('text')
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
    return post;
  },
};

const Mutation = {
  /**
   * Creates a new Post
   *
   * @param {string} text
   * @param {string} treeId
   * @param {string} image
   * @param {string} authorId
   */
  createPost: async (
    root,
    { input: { text, image, authorId, treeId, groupId } },
    { Post, User, Tree, Group }
  ) => {
    if (!text && !image) {
      throw new Error('Post text or image is required.');
    }

    let imageUrl, imagePublicId;
    if (image) {
      const { createReadStream } = await image;
      const stream = createReadStream();
      const uploadImage = await uploadToCloudinary(stream, 'Post');

      if (!uploadImage.secure_url) {
        throw new Error(
          'Something went wrong while uploading image to Cloudinary'
        );
      }

      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }

    const newPost = await new Post({
      text,
      image: imageUrl,
      imagePublicId,
      tree: treeId,
      group: groupId,
      author: authorId,
    }).save();

    await User.findOneAndUpdate(
      { _id: authorId },
      { $push: { posts: newPost.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $push: { posts: newPost.id } }
    );

    await Group.findOneAndUpdate(
      { _id: groupId },
      { $push: { posts: newPost.id } }
    );
    return newPost;
  },
  /**
   * Deletes a user Post
   *
   * @param {string} id
   * @param {imagePublicId} id
   */
  deletePost: async (
    root,
    { input: { id, treeId, groupId, imagePublicId } },
    { Post, Group, Tree, User, Like, Comment, Notification }
  ) => {
    // Remove Post image from cloudinary, if imagePublicId is present
    if (imagePublicId) {
      const deleteImage = await deleteFromCloudinary(imagePublicId);

      if (deleteImage.result !== 'ok') {
        throw new Error(
          'Something went wrong while deleting image from Cloudinary'
        );
      }
    }

    // Find Post and remove it
    const post = await Post.findByIdAndRemove(id);

    // Delete Post from authors (users) Posts collection
    await User.findOneAndUpdate(
      { _id: post.author },
      { $pull: { posts: post.id } }
    );

    await Tree.findOneAndUpdate(
      { _id: treeId },
      { $pull: { posts: post.id } }
    );

    await Group.findOneAndUpdate(
      { _id: groupId },
      { $pull: { posts: post.id } }
    );

    // Delete Post likes from likes collection
    await Like.find({ post: post.id }).deleteMany();
    // Delete Post likes from users collection
    post.likes.map(async likeId => {
      await User.where({ likes: likeId }).update({ $pull: { likes: likeId } });
    });

    // Delete Post comments from comments collection
    await Comment.find({ post: post.id }).deleteMany();
    // Delete comments from users collection
    post.comments.map(async commentId => {
      await User.where({ comments: commentId }).update({
        $pull: { comments: commentId },
      });
    });

    // Find user notification in users collection and remove them
    const userNotifications = await postNotification.find({ post: post.id });

    userNotifications.map(async notification => {
      await User.where({ notifications: notification.id }).update({
        $pull: { postNotifications: notification.id },
      });
    });
    // Remove notifications from notifications collection
    await postNotification.find({ post: post.id }).deleteMany();

    return post;
  },
};

export default { Query, Mutation };