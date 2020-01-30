import { gql } from 'apollo-server-express';

/**
 * Follow schema
 */
const FollowSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Follow @model{
    id: ID @isUnique
    author: ID! @relation(name: "FollowOwner")
    tree: ID
    group: ID
    access: [Access!]! @relation(name: "AccessFollowers")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input ObjectscreateGroupFollow
  # ---------------------------------------------------------
  input CreateTreeFollowInput {
    authorId: ID!
    treeId: ID
  }

  input DeleteTreeFollowInput {
    id: ID!
  }

  input CreateGroupFollowInput {
    authorId: ID!
    groupId: ID
  }

  input DeleteGroupFollowInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
type FollowerTreePayload {
  id: ID!
  author: UserPayload!
  tree: TreePayload
  createdAt: Date
}

type FollowersTreePayload {
  followers: [FollowerTreePayload]!
  count: String!
}

type FollowerGroupPayload {
  id: ID!
  author: UserPayload!
  group: GroupPayload
  createdAt: Date
}

type FollowersGroupPayload {
  followers: [FollowerGroupPayload]!
  count: String!
}
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets all tree testimonial
    getTreeFollowers(authUserId: ID!, skip: Int, limit: Int): FollowersTreePayload

    # Gets testimonial by id
    getTreeFollower(id: ID!): FollowerTreePayload

    # Gets all tree Follower
    getGroupFollowers(authUserId: ID!, skip: Int, limit: Int): FollowersGroupPayload

    # Gets Follower by id
    getGroupFollower(id: ID!): FollowerGroupPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a following/follower relationship between trees and users
    createTreeFollow(input: CreateTreeFollowInput!): Follow

    # Deletes a following/follower relationship between trees and users
    deleteTreeFollow(input: DeleteTreeFollowInput!): FollowerTreePayload

    # Creates a following/follower relationship between groups and users
    createGroupFollow(input: CreateGroupFollowInput!): Follow

    # Deletes a following/follower relationship between groups and users
    deleteGroupFollow(input: DeleteGroupFollowInput!): FollowerGroupPayload
  }
`;

export default FollowSchema;
