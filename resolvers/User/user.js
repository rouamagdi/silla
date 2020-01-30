import bcrypt from 'bcryptjs';

import { uploadToCloudinary } from '../../utils/cloudinary';
import { generateToken } from '../../utils/generate-token';

import { withFilter } from 'apollo-server';
import { pubSub } from '../../utils/apollo-server';

import { IS_USER_ONLINE } from '../../constants/Subscriptions';

const AUTH_TOKEN_EXPIRY = '1y';
const RESET_PASSWORD_TOKEN_EXPIRY = 3600000;

const Query = {
  /**
   * Gets the currently logged in user
   */
  getAuthUser: async (root, args, { authUser, User }) => {
    if (!authUser) return null;

    const user = await User.findOne({ phone: authUser.phone })
      .populate({ path: 'trees', options: { sort: { createdAt: 'desc' } } })
      .populate('following')
      .populate({
        path: 'notifications',
        populate: [
          { path: 'author' },
          { path: 'following' },
          { path: 'trees',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
          { path: 'groups',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
        ],
        match: { seen: false },
      });

    user.newNotifications = user.notifications;

    // Find unseen messages
    const lastUnseenMessages = await Message.aggregate([
      {
        $match: {
          receiver: mongoose.Types.ObjectId(authUser.id),
          seen: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$sender',
          doc: {
            $first: '$$ROOT',
          },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
    ]);

    // Transform data
    const newConversations = [];
    lastUnseenMessages.map(u => {
      const user = {
        id: u.sender[0]._id,
        name: u.sender[0].name,
        image: u.sender[0].image,
        lastMessage: u.message,
        lastMessageCreatedAt: u.createdAt,
      };

      newConversations.push(user);
    });

    // Sort users by last created messages date
    const sortedConversations = newConversations.sort((a, b) =>
      b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
    );

    // Attach new conversations to auth User
    user.newConversations = sortedConversations;

    return user;
  },
  /**
   * Gets user by name
   *
   * @param {string} name
   */
  getUser: async (root, { name }, { User }) => {
    const user = await User.findOne({ name })
    .populate({ path: 'trees', options: { sort: { createdAt: 'desc' } } })
    .populate('following')
    .populate({
      path: 'notifications',
      populate: [
        { path: 'author' },
        { path: 'follow' },
        { path: 'trees',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
          { path: 'groups',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
      ],
        options: { sort: { createdAt: 'desc' } },
      });

    if (!user) {
      throw new Error("User with given name doesn't exists.");
    }

    return user;
  },
  /**
   * Gets user trees by name
   *
   * @param {string} name
   * @param {int} skip how many trees to skip
   * @param {int} limit how many trees to limit
   */
  getUserTrees: async (root, { name, skip, limit }, { User, Tree }) => {
    const user = await User.findOne({ name }).select('_id');

    const query = { author: user._id };
    const count = await Tree.find(query).countDocuments();
    const trees = await Tree.find(query)
    .populate({ path: 'trees', options: { sort: { createdAt: 'desc' } } })
    .populate('following')
    .populate({
      path: 'notifications',
      populate: [
        { path: 'author' },
        { path: 'follow' },
        { path: 'trees',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
          { path: 'groups',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
      ]})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { posts, count };
  },
  /**
   * Gets all users
   *
   * @param {string} authorId
   * @param {int} skip how many users to skip
   * @param {int} limit how many users to limit
   */
  getUsers: async (root, { authorId, skip, limit }, { User, Follow }) => {
    // Find user ids, that current user follows
    const userFollowing = [];
    const follow = await Follow.find({ follower: authorId }, { _id: 0 }).select(
      'user'
    );
    follow.map(f => userFollowing.push(f.user));

    // Find users that user is not following
    const query = {
      $and: [{ _id: { $ne: authorId } }, { _id: { $nin: userFollowing } }],
    };
    const count = await User.where(query).countDocuments();
    const users = await User.find(query)
    .populate({ path: 'trees', options: { sort: { createdAt: 'desc' } } })
    .populate('following')
    .populate({
      path: 'notifications',
      populate: [
        { path: 'author' },
        { path: 'follow' },
        { path: 'trees',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
          { path: 'groups',
            populate: { 
              path: 'conversation', populate:['message'],
              path: 'donation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'post', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'invitation', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'memory', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}],
              path: 'testimonial', populate: [{ path: 'like' }, { path: 'comment', populate: { path: 'author' }}]
            }
          },
      ]})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { users, count };
  },
  /**
   * Searches tree by treename
   *
   * @param {string} searchQuery
   */
  searchUsers: async (root, { searchQueryUser }, { User }) => {
    // Return an empty array if searchQuery isn't presented
    if (!searchQueryUser) {
      return [];
    }

    const users = User.find({
      $or: [
        { name: new RegExp(searchQueryUser, 'i') }
      ],
      _id: {
        $ne: authUser.id,
      },
    }).limit(50);
    
    return users;
  },
  searchTree: async (root, { searchQueryTree }, { Tree }) => {
    // Return an empty array if searchQuery isn't presented
    if (!searchQueryTree) {
      return [];
    }

    const trees = Tree.find({
      $or: [
        { treename: new RegExp(searchQueryTree, 'i') }
      ],
    }).limit(50);

    return trees;
  },
  searchTreePhones: async (root, { searchQueryTreePhone }, { Tree }) => {
    // Return an empty array if searchQuery isn't presented
    if (!searchQuery) {
      return [];
    }

    const phones = Tree.follower.find({
      $or: [
        { phone: new RegExp(searchQueryTreePhone, 'i') }
      ],
    }).limit(50);

    return phones;
  },
  searchGroup: async (root, { searchQueryGroup }, { Group }) => {
    // Return an empty array if searchQuery isn't presented
    if (!searchQueryGroup) {
      return [];
    }

    const groups = Group.find({
      $or: [
        { groupname: new RegExp(searchQueryGroup, 'i') }
      ],
    }).limit(50);

    return groups;
  },
  searchGroupPhones: async (root, { searchQueryGroupPhone }, { Group }) => {
    // Return an empty array if searchQuery isn't presented
    if (!searchQuery) {
      return [];
    }

    const phones = Group.follower.find({
      $or: [
        { phone: new RegExp(searchQueryGroupPhone, 'i') }
      ],
    }).limit(50);

    return phones;
  },
  /**
   * Gets Suggested tree for people 
  //  *
  //  * @param {string} authorId
  //  */
  // suggestPeople: async (root, { authorId, treeId }, { Tree, Follow }) => {
  //   const LIMIT = 6;

  //   // Find who user follows
  //   const userFollowing = [];
  //   const following = await Follow.find(
  //     { follower: authorId },
  //     { tree: treeId },
  //     { _id: 0 }
  //   ).select('user');
  //   following.map(f => userFollowing.push(f.user));
  //   userFollowing.push(treeId);

  //   // Find random trees
  //   const query = { _id: { $nin: userFollowing } };
  //   const treesCount = await Tree.where(query).countDocuments();
  //   let random = Math.floor(Math.random() * treesCount);

  //   const usersLeft = usersCount - random;
  //   if (usersLeft < LIMIT) {
  //     random = random - (LIMIT - usersLeft);
  //     if (random < 0) {
  //       random = 0;
  //     }
  //   }

  //   const randomUsers = await User.find(query)
  //     .skip(random)
  //     .limit(LIMIT);

  //   return randomUsers;
  // },
  /**
   * Verifies reset password token
   *
   * @param {string} phone
   * @param {string} token
   */
  verifyResetPasswordToken: async (root, { phone, token }, { User }) => {
    // Check if user exists and token is valid
    const user = await User.findOne({
      phone,
      passwordResetToken: token,
      passwordResetTokenExpiry: {
        $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }

    return { message: 'Success' };
  },
};

const Mutation = {
  /**
   * Signs in user
   *
   * @param {string} phone
   * @param {string} password
   */
  signin: async (root, { input: { phone, name, password } }, { User }) => {
    const user = await User.findOne().or([
      { phone: phone },
      { name: name },
    ]);

    if (!user) {
      throw new Error('User not found.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password.');
    }

    return {
      token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY),
    };
  },
  /**
   * Signs up user
   *
   * @param {string} phone
   * @param {string} name
   * @param {string} password
   */
  signup1: async (
    root,
    { input: { phone } },
    { User }
  ) => {
    // Check if user with given phone or name already exists
    const user = await User.findOne().or([{ phone }]);
  
     // Phone validation
    //  const phoneRegex = /^(\()?[2-9]{1}\d{2}(\))?(-|\s)?[2-9]{1}\d{2}(-|\s)\d{4}$/;
    //  if (!phoneRegex.test(Number(phone))) {
    //    throw new Error('Enter a valid Phone address.');
    //  }
    
    const newUser = await new User({
      phone
    }).save();

    return {
      token: generateToken(newUser, process.env.SECRET, AUTH_TOKEN_EXPIRY),
    };
  },
  signup2: async (
    root,
    { input: { password } },
    { User }
  ) => {
    const newUser = await new User({
      password,
    }).save();

    return newUser;
  },
  signup3: async (
    root,
    { name, gender, authorId },
    { User }
  ) => {
    
    // Empty field validation
    if ( !name ) {
      throw new Error('All fields are required.');
    }
   
    // User name validation
    const nameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    if (!nameRegex.test(name)) {
      throw new Error(
        'User Name can only use letters, numbers, underscores and periods.'
      );
    }
    if (name.length > 20) {
      throw new Error('Username no more than 50 characters.');
    }
    if (name.length < 3) {
      throw new Error('Username min 3 characters.');
    }
    const frontEndPages = [
      'explore',
      'people',
      'notifications',
      'post',
    ];
    if (frontEndPages.includes(name)) {
      throw new Error("This username isn't available. Please try another.");
    }

  const user = await User.findOneAndUpdate(
    { _id: authorId },
    { $push: { name: name, gender: gender } }
  );

  await user.save();

  return user;

  },
  
  /**
   * Requests reset password
   *
   * @param {string} phone
   */
  requestPasswordReset: async (root, { input: { phone } }, { User }) => {
    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error(`No such user found for email ${phone}.`);
    }

    // Set password reset token and it's expiry
    const token = generateToken(
      user,
      process.env.SECRET,
      RESET_PASSWORD_TOKEN_EXPIRY
    );
    const tokenExpiry = Date.now() + RESET_PASSWORD_TOKEN_EXPIRY;
    await User.findOneAndUpdate(
      { _id: user.id },
      { passwordResetToken: token, passwordResetTokenExpiry: tokenExpiry },
      { new: true }
    );

    // Email user reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${token}`;
    // const mailOptions = {
    //   to: email,
    //   subject: 'Password Reset',
    //   html: resetLink,
    // };

    // await sendEmail(mailOptions);

    // Return success message
    // return {
    //   message: `A link to reset your password has been sent to ${email}`,
    // };
  },
  /**
   * Resets user password
   *
   * @param {string} phone
   * @param {string} token
   * @param {string} password
   */
  // resetPassword: async (
  //   root,
  //   { input: { email, token, password } },
  //   { User }
  // ) => {
  //   if (!password) {
  //     throw new Error('Enter password and Confirm password.');
  //   }

  //   if (password.length < 6) {
  //     throw new Error('Password min 6 characters.');
  //   }

  //   // Check if user exists and token is valid
  //   const user = await User.findOne({
  //     email,
  //     passwordResetToken: token,
  //     passwordResetTokenExpiry: {
  //       $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
  //     },
  //   });
  //   if (!user) {
  //     throw new Error('This token is either invalid or expired!.');
  //   }

  //   // Update password, reset token and it's expiry
  //   user.passwordResetToken = '';
  //   user.passwordResetTokenExpiry = '';
  //   user.password = password;
  //   await user.save();

  //   // Return success message
  //   return {
  //     token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY),
  //   };
  // },
  /**
   * Uploads user Profile or Cover photo
   *
   * @param {string} id
   * @param {obj} image
   * @param {string} imagePublicId
   * @param {bool} isCover is Cover or Profile photo
   */
  uploadUserPhoto: async (
    root,
    {  id, image, imagePublicId, isCover  },
    { User }
  ) => {
    const { createReadStream } = await image;
    const stream = createReadStream();
    const uploadImage = await uploadToCloudinary(stream, 'user', imagePublicId);

    if (uploadImage.secure_url) {
      const fieldsToUpdate = {};
      if (isCover) {
        fieldsToUpdate.coverImage = uploadImage.secure_url;
        fieldsToUpdate.coverImagePublicId = uploadImage.public_id;
      } else {
        fieldsToUpdate.image = uploadImage.secure_url;
        fieldsToUpdate.imagePublicId = uploadImage.public_id;
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { ...fieldsToUpdate },
        { new: true }
      )
        .populate('trees')
        .populate('chat')
        .populate('messages')
        .populate('posts')
        .populate('donations')
        .populate('invitation')
        .populate('memorys')
        .populate('testimonials')
        .populate('likes')
        .populate('comments');
      return updatedUser;
    }

    throw new Error(
      'Something went wrong while uploading image to Cloudinary.'
    );
  },
};
const Subscription = {
  /**
   * Subscribes to user's isOnline change event
   */
  isUserOnline: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(IS_USER_ONLINE),
      (payload, variables, { authUser }) => variables.authUserId === authUser.id
    ),
  },
};
export default { Query, Mutation, Subscription };