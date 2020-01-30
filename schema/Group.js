import { gql } from 'apollo-server-express';

/**
 * Group schema
 */
const GroupSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Group @model{
    id: ID! @isUnique
    groupname: String
    image: File
    author: ID! @relation(name: "GroupOwner")
    posts: [Post]
    invitations: [Invitation]
    donations: [Donation]
    testimonials: [Testimonial]
    followers: [Follow]
    access: [Access!]! @relation(name: "AccessGroup")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateGroupInput {
    groupname: String
    image: Upload
    imagePublicId: String
    authorId: ID!
  }

  input DeleteGroupInput {
    id: ID!
    imagePublicId: String
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type UserGroupsPayload {
    groups: [GroupPayload]!
    count: String!
  }
  
  type GroupPayload {
    id: ID!
    groupname: String
    image: File
    author: ID!
    posts: [PostPayload]
    invitations: [InvitationPayload]
    donations: [DonationPayload]
    testimonials: [TestimonialPayload]
    # notifications: [groupNotificationsPayload]
    followers: [FollowerGroupPayload]
    following: [FollowerGroupPayload]
    createdAt: Date
  }
  type GroupsPayload {
    groups: [GroupPayload]!
    count: String!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
   # Searches group by groupname
   searchGroup(searchQueryGroup: String!): [GroupPayload]

    # Searches users by phone in group
    searchGroupPhones(searchQueryGroupPhone: String!): [GroupPayload]

    # Gets all groups
    getGroups(authorId: ID, skip: Int, limit: Int): GroupsPayload

    # Gets group by id
    getGroup(groupId: ID!): GroupPayload

    # Gets user Groups by groupname
    getUserGroups(groupname: String!, skip: Int, limit: Int): GroupPayload

    # Gets group from followed users
    getFollowedGroups(authorId: String!, skip: Int, limit: Int): GroupsPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new group
    createGroup(input: CreateGroupInput!): GroupPayload

    # Deletes a user group
    deleteGroup(input: DeleteGroupInput!): GroupPayload
  }
`;

export default GroupSchema;