import { gql } from 'apollo-server-express';

/**
 * Profile schema
 */
const ProfileSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Profile @model{
    id: ID! @isUnique
    nickname: String
    job: String
    Bio: String
    academicAertificate: String
    address: String
    location: String
    hobbys: [String]
    dateOfBirth: Date
    author: ID! @relation(name: "ProfileOwner")
    access: [Access!]! @relation(name: "AccessProfile")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateProfileInput {
    nickname: String
    job: String
    Bio: String
    academicAertificate: String
    address: String
    location: String
    hobbys: String
    dateOfBirth: Date
    authorId: ID!
  }

  input DeleteProfileInput{
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type ProfilePayload {
    id: ID!
    nickname: String
    job: String
    Bio: String
    academicAertificate: String
    address: String
    location: String
    hobbys: String
    dateOfBirth: Date
    memory:[MemoryPayload]
    achievement:[AchievementPayload]
    author: ID!
    createdAt: Date
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    #Gets User Profile
    getProfile(authorId: ID!, skip: Int, limit: Int): ProfilePayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new  Profile
    createProfile(input: CreateProfileInput!): ProfilePayload
    
    # Deletes a user Profile
    deleteProfile(input: DeleteProfileInput!): ProfilePayload
  }
`;

export default ProfileSchema;