import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema that describes the main functionality of the API
 *
 * https://www.apollographql.com/docs/apollo-server/schema/schema/
 */

const schema = gql`
  # ---------------------------------------------------------
  # Custom scalars and enums
  # ---------------------------------------------------------
  
  scalar Date
  scalar Number
  directive @relation(name: String) on OBJECT | FIELD_DEFINITION 
  directive @model  on OBJECT 
  directive @isUnique(id: ID) on FIELD_DEFINITION
  # ---------------------------------------------------------
  # Model and Root Query Objects
  # ---------------------------------------------------------

  type postLike @model{
    id: ID! @isUnique
    post: Post!
    author: [User!]! @relation(name: "PostLikeOwner")
    access: [Access!]! @relation(name: "AccessPostLikes")
    createdAt: Date
  }

  type Invitation @model{
    id: ID! @isUnique
    tree: Tree
    group: Group
    author: [User!]! @relation(name: "InvitationOwner")
    text: String
    image: File
    likes: [invitationLike]
    comments: [invitationComment]
    access: [Access!]! @relation(name: "AccessInvitations")
    createdAt: Date
    dateto: Date
  }

  type invitationLike @model{
    id: ID! @isUnique
    invitation: Invitation!
    author: [User!]! @relation(name: "InvitationLikeOwner")
    access: [Access!]! @relation(name: "AccessInvitationLikes")
    createdAt: Date
  }

  type invitationComment @model{
    id: ID! @isUnique
    comment: String!
    author: [User!]! @relation(name: "InvitationCommentOwner")
    access: [Access!]! @relation(name: "AccessInvitationComments")
    invitation: Invitation!
    createdAt: Date
  }

  type Testimonial @model{
    id: ID! @isUnique
    tree: Tree
    group: Group
    author: [User!]! @relation(name: "TestimonialOwner")
    image: File
    question: String!
    options: optionsPayload
    voted: Number
    likes: [testimonialLike]
    comments: [testimonialComment]
    access: [Access!]! @relation(name: "AccessTestimonials")
    createdAt: Date
    dateto: Date
  }

  type testimonialLike @model{
    id: ID! @isUnique
    testimonial: Testimonial!
    author: [User!]! @relation(name: "TestimonialLikeOwner")
    access: [Access!]! @relation(name: "AccessTestimonialLikes")
    createdAt: Date
  }

  type testimonialComment @model{
    id: ID! @isUnique
    comment: String!
    author: [User!]! @relation(name: "TestimonialCommentOwner")
    testimonial: Testimonial!
    access: [Access!]! @relation(name: "AccessTestimonialComments")
    createdAt: Date
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  
  
  type Follow @model{
    id: ID @isUnique
    author: [User!]! @relation(name: "FollowOwner")
    tree: Tree
    group: Group
    access: [Access!]! @relation(name: "AccessFollowers")
    createdAt: Date
  }

  enum notificationType {
    CHAT
    FOLLOW
    LIKE
    COMMENT
    DONATION
    POST
    INVITATION
    TESTIMONIAL
  }

    enum UserRole {
    EDITOR,
    MODERATOR,
    ADMIN
  }

  enum AccessOperation {
    READ,
    UPDATE,
    DELETE
  }

  type chatNotification {
    id: ID!
    tree: Tree
    group: Group
    author: [User!]! 
    chat: Chat!
    message: Message
    type: notificationType
    seen: Boolean
    createdAt: Date
  }

  type donationNotification {
    id: ID!
    tree: Tree
    group: Group
    author: User!
    donation: Donation!
    like: donationLike
    comment: donationComment
    type: notificationType
    seen: Boolean
    createdAt: Date
  }

  type memoryNotification {
    id: ID!
    tree: Tree
    group: Group
    author: User!
    memory: Memory!
    like: memoryLike
    comment: memoryComment
    type: notificationType
    seen: Boolean
    createdAt: Date
  }

  type postNotification {
    id: ID!
    tree: Tree
    group: Group
    author: User!
    post: Post!
    like: postLike
    comment: postComment
    type: notificationType
    seen: Boolean
    createdAt: Date
  }

  type invitationNotification {
    id: ID!
    tree: Tree
    group: Group
    author: User!
    invitation: Invitation!
    like: invitationLike
    comment: invitationComment
    type: notificationType
    seen: Boolean
    createdAt: Date
  }

  type testimonialNotification {
    id: ID!
    tree: Tree
    group: Group
    author: User!
    testimonial: Testimonial!
    like: testimonialLike
    comment: testimonialComment
    type: notificationType
    seen: Boolean
    createdAt: Date
  }

  type treeNotification {
    id: ID!
    author: User!
    chat:Chat
    donation: Donation
    post: Post
    invitation: Invitation
    testimonial: Testimonial
    type: notificationType
    seen: Boolean
    createdAt: Date
  }
  type Token {
    token: String!
  }

  type successMessage {
    message: String!
  }

  type Access {
    id: ID
    operation: AccessOperation!
    members: [User!]! @relation(name: "AccessMembers")
    posts: [Post!]! @relation(name: "AccessPosts")
    postLikes: [postLike!]! @relation(name: "AccessPostLikes")
    postComments: [postComment!]! @relation(name: "AccessPostComments")
    chats: [Chat!]! @relation(name: "AccessChats")
    messages: [Message!]! @relation(name: "AccessMessages")
    donations: [Donation!]! @relation(name: "AccessDonations")
    donationLikes: [donationLike!]! @relation(name: "AccessDonationLikes")
    donationComments: [donationComment!]! @relation(name: "AccessDonationComments")
    invitations: [Invitation!]! @relation(name: "AccessInvitations")
    invitationLikes: [invitationLike!]! @relation(name: "AccessInvitationLikes")
    invitationComments: [invitationComment!]! @relation(name: "AccessInvitationComments")
    testimonials: [Testimonial!]! @relation(name: "AccessTestimonials")
    testimonialLikes: [testimonialLike!]! @relation(name: "AccessTestimonialLikes")
    testimonialComments: [testimonialComment!]! @relation(name: "AccessTestimonialComments")
    followers: [Follow!]! @relation(name: "AccessFollowers")
    fakeMambers: [FakeMamber!]! @relation(name: "AccessFakeMambers")
    photoAlbums: [photoAlbum!]! @relation(name: "AccessPhotoAlbum")
    familys: [Family!]! @relation(name: "AccessFamilys")
    profiles: [Profile!]! @relation(name: "AccessProfile")
    memorys: [Memory!]! @relation(name: "AccessMemorys")
    groups: [Group!]! @relation(name: "AccessGroup")
    trees: [Tree!]! @relation(name: "AccessTree")
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  
  input createTreeNotificationInput {
    authorId: ID!
    treeId: ID
    notificationType: notificationType!
    notificationTypeId: ID
  }

  input deleteTreeNotificationInput {
    id: ID!
  }

  input updateTreeNotificationSeenInput {
    authorId: ID!
    treeId: ID!
  }

  input createGroupNotificationInput {
    authorId: ID!
    groupId: ID
    notificationType: notificationType!
    notificationTypeId: ID
  }

  input deleteGroupNotificationInput {
    id: ID!
  }

  input updateGroupNotificationSeenInput {
    authorId: ID!
    groupId: ID!
  }
  input createFollowInput {
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input deleteFollowInput {
    id: ID!
  }

  input createDonationNotificationInput {
    authorId: ID!
    treeId: ID
    groupId: ID
    donationId: ID
    notificationType: notificationType!
    notificationTypeId: ID
  }

  input deleteDonationNotificationInput {
    id: ID!
  }

  input updateDonaionNotificationSeenInput {
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input createInvitationInput {
    text: String
    image: Upload
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input deleteInvitationInput {
    id: ID!
  }

  input createInvitationLikeInput {
    authorId: ID!
    invitationId: ID!
  }

  input deleteInvitationLikeInput {
    id: ID!
  }

  input createInvitationCommentInput {
    comment: String!
    author: ID!
    invitationId: ID!
  }

  input deleteInvitationCommentInput {
    id: ID!
  }

  input createInvitationNotificationInput {
    treeId: ID
    groupId: ID
    authorId: ID!
    invitationId: ID
    notificationType: notificationType!
    notificationTypeId: ID
  }

  input deleteInvitationNotificationInput {
    id: ID!
  }

  input updateInvitationNotificationSeenInput {
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input createMemoryNotificationInput {
    treeId: ID!
    authorId: ID!
    memoryId: ID
    notificationType: notificationType!
    notificationTypeId: ID
  }

  input deleteMemoryNotificationInput {
    id: ID!
  }

  input updateMemoryNotificationSeenInput {
    authorId: ID!
  }

  input createPostLikeInput {
    authorId: ID!
    postId: ID!
  }

  input deletePostLikeInput {
    id: ID!
  }

  input createPostNotificationInput {
    authorId: ID!
    treeId: ID
    groupId: ID
    postId: ID
    notificationType: notificationType!
    notificationTypeId: ID
  }

  input deletePostNotificationInput {
    id: ID!
  }

  input updatePostNotificationSeenInput {
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input optionsInput{
    option: String
    votes: Number
  }
  
  input createTestimonialInput {
    question: String
    options: [optionsInput]
  	voted: Number
    image: Upload
    imagePublicId: String
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input deleteTestimonialInput {
    id: ID!
    imagePublicId: String
  }

  input createTestimonialLikeInput {
    authorId: ID!
    testimonialId: ID!
  }

  input deleteTestimonialLikeInput {
    id: ID!
  }

  input createTestimonialCommentInput {
    comment: String!
    author: ID!
    testimonialId: ID!
  }

  input deleteTestimonialCommentInput {
    id: ID!
  }

  input createTestimonialNotificationInput {
    treeId: ID
    groupId: ID
    authorId: ID!
    testimonialId: ID
    notificationType: notificationType!
    notificationTypeId: ID
  }

  input deleteTestimonialNotificationInput {
    id: ID!
  }

  input updateTestimonialNotificationSeenInput {
    authorId: ID!
    treeId: ID
    groupId: ID
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  

  

  type treeNotificationPayload {
    id: ID
    followers: [followPayload]
    following: [followPayload]
    author: ID
    chats: [chatPayload]
    posts: [postPayload]
    invitations: [invitationPayload]
    donations: [donationPayload]
    testimonials: [testimonialPayload]
    createdAt: Date
  }

  type treeNotificationsPayload {
    count: Number!
    notifications: [treeNotificationPayload]!
  }


  type groupNotificationPayload {
    id: ID
    followers: [followPayload]
    following: [followPayload]
    author: ID
    chats: [chatPayload]
    posts: [postPayload]
    invitations: [invitationPayload]
    donations: [donationPayload]
    testimonials: [testimonialPayload]
    createdAt: Date
  }

  type groupNotificationsPayload {
    count: Number!
    notifications: [groupNotificationPayload]!
  }}

  type followPayload {
    id: ID!
    author: ID!
    group: ID
    tree: ID
    createdAt: Date
  }

  type followsPayload {
    follows: [followsPayload]!
    count: String!
  }

  type usersPayload {
    authors: [userPayload]!
    count: String!
  }

  type chatPayload {
    id: ID!
    author: ID!
    contact: ID!
    messages: [messagePayload]
    notifications: [chatNotificationsPayload]
    tree: ID
    group: ID
    createdAt: Date
  }

  type chatsPayload {
    chats: [chatPayload]!
    count: String!
  }

  type chatNotificationPayload {
    id: ID
    author: ID
    contact: ID
    message: ID
    createdAt: Date
  }

  type chatNotificationsPayload {
    count: String!
    notifications: [chatNotificationPayload]!
  }

  type donationNotificationPayload {
    id: ID
    author: ID
    like: ID
    comment: ID
    createdAt: Date
  }

  type donationNotificationsPayload {
    count: String!
    notifications: [donationNotificationPayload]!
  }

  type postLikePayload {
    id: ID!
    post: ID!
    author: ID!
  }

  type postNotificationPayload {
    id: ID
    author: ID
    like: ID
    comment: ID
    createdAt: Date
  }

  type postNotificationsPayload {
    count: Number!
    notifications: [postNotificationPayload]!
  }

  type memoryNotificationPayload {
    id: ID
    author: userPayload
    like: memoryLikePayload
    comment: memoryCommentPayload
    createdAt: Date
  }

  type memoryNotificationsPayload {
    count: Number!
    memoryNotifications: [memoryNotificationPayload]!
  }

  type invitationPayload {
    id: ID!
    text: String
    image: File
    imagePublicId: String
    author: userPayload!
    likes: [invitationLikePayload]
    comments: [invitationCommentPayload]
    tree: treePayload
    group: groupPayload
    createdAt: Date
    dateTo: Date
  }

  type invitationsPayload {
    invitations: [invitationPayload]!
    count: String!
  }

  type invitationLikePayload {
    id: ID!
    invitation: invitationPayload
    author: userPayload
  }

  type invitationNotificationPayload {
    id: ID
    author: userPayload
    like: invitationLikePayload
    comment: invitationCommentPayload
    createdAt: Date
  }

  type invitationNotificationsPayload {
    count: String!
    notifications: [invitationNotificationPayload]!
  }

  type invitationCommentPayload {
    id: ID
    comment: String
    author: userPayload
    invitation: invitationPayload
    createdAt: Date
  }

type testimonialPayload {
    id: ID!
    question: String!
    options: optionsPayload
    voted: Number
    author: userPayload!
    likes: [testimonialLikePayload]
    comments: [testimonialCommentPayload]
    tree: treePayload
    group: groupPayload
    createdAt: Date
    dateto: Date
  }

  type testimonialsPayload {
    testimonials: [testimonialPayload]!
    count: String!
  }

  type testimonialLikePayload {
    id: ID!
    testimonial: testimonialPayload
    authorId: userPayload
  }

  type testimonialNotificationPayload {
    id: ID
    author: userPayload
    like: testimonialLikePayload
    comment: testimonialCommentPayload
    createdAt: Date
  }

  type testimonialNotificationsPayload {
    count: String!
    notifications: [testimonialNotificationPayload]!
  }

  type testimonialCommentPayload {
    id: ID
    comment: Number
    author: userPayload
    post: postPayload
    createdAt: Date
  }
  type optionsPayload{
    option: String
    votes: Number
  }
  # ---------------------------------------------------------
  # Query Root
  # ---------------------------------------------------------
  type Query {
    # Verifies reset password token
    verifyResetPasswordToken(phone: Number, token: String!): successMessage

    # Gets the currently logged in user
    getAuthUser: userPayload

    # Gets user by phone number
    getUser(phone: Number!): userPayload
    
    # Gets all users
    getUsers(authorId: ID!, skip: Int, limit: Int): usersPayload
    
#-----------------------------------------------------------------------------------

    # Gets tree notifications for specific user
    getDonationNotifications(authorId: ID! skip: Int limit: Int): donationNotificationsPayload
#-----------------------------------------------------------------------------------


    # Gets all tree invitation
    getInvitations(authUserId: ID!, skip: Int, limit: Int): invitationsPayload

    # Gets invitation by id
    getInvitation(id: ID!): invitationPayload

    # Gets tree notifications for specific user
    getInvitationNotifications(authorId: ID! skip: Int limit: Int): invitationNotificationsPayload
#-----------------------------------------------------------------------------------
    # Gets tree notifications for specific user
    getMemoryNotifications(authorId: ID! skip: Int limit: Int): memoryNotificationsPayload

#-----------------------------------------------------------------------------------

    # Gets all tree testimonial
    getTestimonials(authUserId: ID!, skip: Int, limit: Int): testimonialsPayload

    # Gets testimonial by id
    getTestimonial(id: ID!): testimonialPayload

    # Gets tree notifications for specific user
    getTestimonialNotifications(authorId: ID! skip: Int limit: Int): testimonialNotificationsPayload

#-----------------------------------------------------------------------------------


    # Gets tree notifications for specific user
    getPostNotifications(authorId: ID! skip: Int limit: Int): postNotificationsPayload
  }

  # ---------------------------------------------------------
  # Mutation Root
  # ---------------------------------------------------------
  type Mutation {
    # Signs in user
    signin(input: signinInput!): Token

    # Signs up user
    signup1(input: signUpInput1!): Token
    signup2(input: signUpInput2!): userPayload
    signup3(input: signUpInput3!): userPayload
   
    # Requests reset password
    requestPasswordReset(input: requestPasswordResetInput!): successMessage

    # Resets user password
    resetPassword(input: resetPasswordInput!): Token

    # Uploads user Cover photo
    uploadUserPhoto(input: uploadUserPhotoInput!): userPayload

    # Creates a following/follower relationship between trees and users
    createTreeFollow(input: createFollowInput!): Follow

    # Deletes a following/follower relationship between trees and users
    deleteTreeFollow(input: deleteFollowInput!): followPayload

    # Creates a following/follower relationship between groups and users
    createGroupFollow(input: createFollowInput!): Follow

    # Deletes a following/follower relationship between groups and users
    deleteGroupFollow(input: deleteFollowInput!): followPayload

    # Creates a new chat
    createChat(input: createChatInput!): chatPayload

    # Deletes a user chat
    deleteChat(input: deleteChatInput!): chatPayload

    # Creates a chat message
    createMessage(input: createMessageInput!): Message

    # Deletes a chat message
    deleteMessage(input: deleteMessageInput!): Message

    # Creates a new chat notification for user
    createChatNotification(input: createChatNotificationInput!): chatNotification

    # Deletes a chat notification
    deleteChatNotification(input: deleteChatNotificationInput!): chatNotification

    # Updates chat notification seen values for user
    updateChatNotificationSeen(input: updateChatNotificationSeenInput!): Boolean

    # Creates a new donation notification for user
    createDonationNotification(input: createDonationNotificationInput!): donationNotification

    # Deletes a donation notification
    deleteDonationNotification(input: deleteDonationNotificationInput!): donationNotification

    # Updates donation notification seen values for user
    updateDonationNotificationSeen(input: updateDonaionNotificationSeenInput!): Boolean

    # Creates a new memory notification for user
    createMemoryNotification(input: createMemoryNotificationInput!): memoryNotification

    # Deletes a memory notification
    deleteMemoryNotification(input: deleteMemoryNotificationInput!): memoryNotification

    # Updates memory notification seen values for user
    updateMemoryNotificationSeen(input: updateMemoryNotificationSeenInput!): Boolean


    # Creates a new invitation
    createInvitation(input: createInvitationInput!): invitationPayload

    # Deletes a user invitation
    deleteInvitation(input: deleteInvitationInput!): invitationPayload

    # Creates a like for invitation
    createInvitationLike(input: createInvitationLikeInput!): invitationLike

    # Deletes a invitation like
    deleteInvitationLike(input: deleteInvitationLikeInput!): invitationLike

    # Creates a invitation comment
    createInvitationComment(input: createInvitationCommentInput!): invitationComment

    # Deletes a invitation comment
    deleteInvitationComment(input: deleteInvitationCommentInput!): invitationComment

    # Creates a new invitation notification for user
    createInvitationNotification(input: createInvitationNotificationInput!): invitationNotification

    # Deletes a invitation notification
    deleteInvitationNotification(input: deleteInvitationNotificationInput!): invitationNotification

    # Updates invitation notification seen values for user
    updateInvitationNotificationSeen(input: updateInvitationNotificationSeenInput!): Boolean

    # Creates a like for post
    createPostLike(input: createPostLikeInput!): postLike

    # Deletes a post like
    deletePostLike(input: deletePostLikeInput!): postLike

    # Creates a new post notification for user
    createPostNotification(input: createPostNotificationInput!): postNotification

    # Deletes a post notification
    deletePostNotification(input: deletePostNotificationInput!): postNotification

    # Updates post notification seen values for user
    updatePostNotificationSeen(input: updatePostNotificationSeenInput!): Boolean


    # Creates a new testimonial
    createTestimonial(input: createTestimonialInput!): testimonialPayload

    # Deletes a user testimonial
    deleteTestimonial(input: deleteTestimonialInput!): testimonialPayload

    # Creates a like for testimonial
    createTestimonialLike(input: createTestimonialLikeInput!): testimonialLike

    # Deletes a testimonial like
    deleteTestimonialLike(input: deleteTestimonialLikeInput!): testimonialLike

    # Creates a testimonial comment
    createTestimonialComment(input: createTestimonialCommentInput!): testimonialComment

    # Deletes a testimonial comment
    deleteTestimonialComment(input: deleteTestimonialCommentInput!): testimonialComment

    # Creates a new testimonial notification for user
    createTestimonialNotification(input: createTestimonialNotificationInput!): testimonialNotification

    # Deletes a testimonial notification
    deleteTestimonialNotification(input: deleteTestimonialNotificationInput!): testimonialNotification

    # Updates testimonial notification seen values for user
    updateTestimonialNotificationSeen(input: updateTestimonialNotificationSeenInput!): Boolean
  }
`;

export default schema;
