import { gql } from 'apollo-server-express';

/**
 * Post schema
 */
const AchievementSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Achievement{
    nationalism: String
    scientific: String
    occupational: String
    profile: Profile!
    author: User!
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateAchievementInput{
    nationalism: String
    scientific: String
    occupational: String
    authorID:ID
    profileId: ID!
    createdAt: Date
  }

  input DeleteAchievementInput{
    id: ID
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type AchievementPayload{
    id: ID!
    nationalism: [String]
    scientific: [String]
    occupational: [String]
    author:ID
    profile: ID!
    createdAt: Date
  }

  type AchievementsPayload {
    achievemens: [AchievementPayload]!
    count: String!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets all achievements
    getAchievements(authorId: ID!, skip: Int, limit: Int): AchievementsPayload

    # Gets Achievement by id
    getAchievement(achievementId: ID!): AchievementPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new Achievement
    createAchievement(input: CreateAchievementInput!): AchievementPayload

    # Deletes a user Achievement
    deleteAchievement(input: DeleteAchievementInput!): AchievementPayload
  }
`;

export default AchievementSchema;