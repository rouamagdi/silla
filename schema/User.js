import { gql } from 'apollo-server-express';

/**
 * User schema
 */
const UserSchema = gql`
  # ---------------------------------------------------------
  # Model and Root Query Objects
  # ---------------------------------------------------------
  type User  @model{
    id: ID! 
    name:String
    gender:String
    phone: String 
    password: String
    resetToken: String
    resetTokenExpiry: String
    image: File
    imagePublicId: String
    trees: [TreePayload]
    groups: [GroupPayload]
    following: [Follow]
    profile: [Profile]
    role: UserRole!
    isOnline: Boolean
    access: [Access!]! @relation(name: "AccessMembers")
    createdAt: Date
  }

  type Token {
    token: String!
  }
  type SuccessMessage {
    message: String!
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input SignInInput {
    phone: Number!
  }

  input SignUpInput1 {
    phone: Number!
  }
  
  input SignUpInput2 {
    password: String!
    authorId: ID!
  }

  input SignUpInput3 {
    name: String!
    gender: String!
    authorId: ID!
  }

  input RequestPasswordResetInput {
    phone: Number!
  }

  input ResetPasswordInput {
    phone: Number!
    token: String!
    password: String!
  }
  input UploadUserPhotoInput {
    id: ID!
    image: Upload!
    imagePublicId: String
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  
  type UserPayload {
    id: ID!
    name: String
    gender: String
    phone: Number
    password: String
    image: File
    imagePublicId: String
    father: UserPayload
    mother: UserPayload
    profile: [ProfilePayload]
    trees: [TreePayload]
    groups: [GroupPayload]
    following: [Follow]
    unseenMessage: Boolean
    # isOnline: Boolean
    # notifications: [NotificationPayload]
    # newNotifications: [NotificationPayload]
    newConversations: [ConversationsPayload]
    createdAt: String
  }

  type SignUpInput3Payload {
    name: String!
    gender: String!
    author: UserPayload!
  }

  type UsersPayload {
    users: [UserPayload]!
    count: String!
  }
  type IsUserOnlinePayload {
    authorId: ID!
    isOnline: Boolean
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    
    # Verifies reset password token
    verifyResetPasswordToken(phone: Number, token: String!): SuccessMessage
    
    # Gets the currently logged in user
    getAuthUser: UserPayload
    
    # Gets user by user name or by id
    getUser(name: String, id: ID): UserPayload
    
    # Gets all users
    getUsers(authorId: String!, skip: Int, limit: Int): UsersPayload
    
    # Searches users by username
    searchUsers(searchQueryUser: String!): [UserPayload]

    # Gets Suggested people for user
    # suggestTree(treeId: String!): [TreePayload]
    # Gets Suggested people for user
    # suggestGroup(groupId: String!): [GroupPayload]
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Signs in user
    signin(input: SignInInput!): Token
    # Signs up user
    signup1( phone: Number!): Token
    signup2(input: SignUpInput2!): UserPayload
    signup3( name: String!, gender: String!, authorId: ID!): SignUpInput3Payload
    # Requests reset password
    requestPasswordReset(input: RequestPasswordResetInput!): SuccessMessage
    # Resets user password
    resetPassword(input: ResetPasswordInput!): Token
    # Uploads user Profile or Cover photo
    uploadUserPhoto(id: ID!, image: Upload!, imagePublicId: String): UserPayload
  }
  # ---------------------------------------------------------
  # Subscriptions
  # ---------------------------------------------------------
  extend type Subscription {
    # Subscribes to is user online event
    isUserOnline(authUserId: ID!, authorId: ID!): IsUserOnlinePayload
  }
`;

export default UserSchema;