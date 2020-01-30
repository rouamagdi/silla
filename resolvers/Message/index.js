import mongoose from 'mongoose';
import { withFilter } from 'apollo-server';

import { pubSub } from '../../utils/apollo-server';
import { MESSAGE_CREATED, NEW_CONVERSATION } from '../../constants/Subscriptions';

const Query = {
  /**
   * Gets user's specific conversation
   *
   * @param {string} authUserId
   * @param {string} authorId
   */
  getMessages: async (root, { authUserId, authorId }, { Message }) => {
    const specificMessage = await Message.find()
      .and([
        { $or: [{ sender: authUserId }, { receiver: authUserId }] },
        { $or: [{ sender: authorId }, { receiver: authorId }] },
      ])
      .populate('sender')
      .populate('receiver')
      .sort({ updatedAt: 'asc' });

    return specificMessage;
  },
  /**
   * Get authors with whom authUser had a conversation
   *
   * @param {string} authUserId
   */
  getConversations: async (root, { authUserId }, { User, Message }) => {
    // Get authors with whom authUser had a chat
    const authors = await User.findById(authUserId).populate(
      'messages',
      'id username fullName image isOnline'
    );

    // Get last messages with wom authUser had a chat
    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              receiver: mongoose.Types.ObjectId(authUserId),
            },
            {
              sender: mongoose.Types.ObjectId(authUserId),
            },
          ],
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
    ]);

    // Attach message properties to authors
    const conversations = [];
    authors.messages.map(u => {
      const author = {
        id: u.id,
        name: u.name,
        image: u.image,
        isOnline: u.isOnline,
      };

      const sender = lastMessages.find(m => u.id === m.sender.toString());
      if (sender) {
        author.seen = sender.seen;
        author.lastMessageCreatedAt = sender.createdAt;
        author.lastMessage = sender.message;
        author.lastMessageSender = false;
      } else {
        const receiver = lastMessages.find(m => u.id === m.receiver.toString());

        if (receiver) {
          author.seen = receiver.seen;
          author.lastMessageCreatedAt = receiver.createdAt;
          author.lastMessage = receiver.message;
          author.lastMessageSender = true;
        }
      }

      conversations.push(author);
    });

    // Sort authors by last created messages date
    const sortedConversations = conversations.sort((a, b) =>
      b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
    );

    return sortedConversations;
  },
};

const Mutation = {
  /**
   * Creates a message
   *
   * @param {string} message
   * @param {string} sender
   * @param {string} receiver
   */
  createMessage: async (
    root,
    { input: { message, sender, receiver } },
    { Message, User }
  ) => {
    let newMessage = await new Message({
      message,
      sender,
      receiver,
    }).save();

    newMessage = await newMessage
      .populate('sender')
      .populate('receiver')
      .execPopulate();

    // Publish message created event
    pubSub.publish(MESSAGE_CREATED, { messageCreated: newMessage });

    // Check if author already had a conversation
    // if not push their ids to authors collection
    const senderUser = await User.findById(sender);
    if (!senderUser.messages.includes(receiver)) {
      await User.findOneAndUpdate(
        { _id: sender },
        { $push: { messages: receiver } }
      );
      await User.findOneAndUpdate(
        { _id: receiver },
        { $push: { messages: sender } }
      );

      newMessage.isFirstMessage = true;
    }

    // Publish message created event
    pubSub.publish(NEW_CONVERSATION, {
      newConversation: {
        receiverId: receiver,
        id: senderUser.id,
        name: senderUser.name,
        image: senderUser.image,
        isOnline: senderUser.isOnline,
        seen: false,
        lastMessage: newMessage.message,
        lastMessageSender: false,
        lastMessageCreatedAt: newMessage.createdAt,
      },
    });

    return newMessage;
  },
  /**
   * Updates message seen values for author
   *
   * @param {string} authorId
   */
  updateMessageSeen: async (
    root,
    { input: { sender, receiver } },
    { Message }
  ) => {
    try {
      await Message.update(
        { receiver, sender, seen: false },
        { seen: true },
        { multi: true }
      );

      return true;
    } catch (e) {
      return false;
    }
  },
};

const Subscription = {
  /**
   * Subscribes to message created event
   */
  messageCreated: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(MESSAGE_CREATED),
      (payload, variables) => {
        const { sender, receiver } = payload.messageCreated;
        const { authUserId, authorId } = variables;

        const isAuthUserSenderOrReceiver =
          authUserId === sender.id || authUserId === receiver.id;
        const isUserSenderOrReceiver =
        authorId === sender.id || authorId === receiver.id;

        return isAuthUserSenderOrReceiver && isUserSenderOrReceiver;
      }
    ),
  },

  /**
   * Subscribes to new conversations event
   */
  newConversation: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(NEW_CONVERSATION),
      (payload, variables, { authUser }) =>
        authUser && authUser.id === payload.newConversation.receiverId
    ),
  },
};

export default { Mutation, Query, Subscription };