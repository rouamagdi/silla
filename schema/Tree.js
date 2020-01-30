import { gql } from 'apollo-server-express';

/**
 * Post schema
 */
const TreeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Tree @model{
    id: ID! @isUnique
    treename: String
    image: File
    author: ID! @relation(name: "TreeOwner")
    posts: [Post]
    invitations: [Invitation]
    donations: [Donation]
    testimonials: [Testimonial]
    followers: [Follow]
    photoAlbum:[PhotoAlbum]
    access: [Access!]! @relation(name: "AccessTree")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateTreeInput {
    treename: String
    image: Upload
    imagePublicId: String
    authorId: ID!
  }

  input DeleteTreeInput {
    id: ID!
    imagePublicId: String
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type UserTreesPayload {
    trees: [TreePayload]!
    count: String!
  }
  type TreePayload {
    id: ID!
    treename: String
    image: File
    author: [UserPayload]
    posts: [PostPayload]
    invitations: [InvitationPayload]
    donations: [DonationPayload]
    testimonials: [TestimonialPayload]
    # notifications: [treeNotificationsPayload]
    followers: [FollowerTreePayload]
    following: [FollowerTreePayload]
    photoAlbum:[PhotoAlbum]
    createdAt: Date
  }

  type TreesPayload {
    trees: [TreePayload]!
    count: String!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    ## Searches tree by treename 
    searchTree(searchQueryTree: String!): [TreePayload]

    # Searches users by phone in tree
    searchTreePhones(searchQueryTreePhone: String!): [TreePayload]

    # Gets all trees
    getTrees(authorId: ID, skip: Int, limit: Int): TreesPayload

    # Gets tree by id
    getTree(treeId: ID!): TreePayload

    # Gets user Trees by treename
    getUserTrees(treename: String!, skip: Int, limit: Int): TreePayload

    # Gets tree from followed users
    getFollowedTrees(authorId: String!, skip: Int, limit: Int): TreesPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new tree
    createTree(input: CreateTreeInput!): TreePayload

    # Deletes a user tree
    deleteTree(input: DeleteTreeInput!): TreePayload
  }
`;

export default TreeSchema;