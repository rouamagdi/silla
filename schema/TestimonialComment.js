import { gql } from 'apollo-server-express';

/**
 * Comment schema
 */
const TestimonialCommentSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type TestimonialComment @model{
    id: ID! @isUnique
    comment: String!
    author: [ID!]! @relation(name: "TestimonialCommentOwner")
    testimonial: ID!
    access: [Access!]! @relation(name: "AccessTestimonialComments")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateTestimonialCommentInput {
    comment: String!
    author: ID!
    testimonialId: ID!
  }

  input DeleteTestimonialCommentInput {
    id: ID!
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type TestimonialCommentPayload {
    id: ID
    comment: Number
    author: UserPayload
    post: PostPayload
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
   # Creates a testimonial comment
   createTestimonialComment(input: CreateTestimonialCommentInput!): TestimonialComment

    # Deletes a testimonial comment
    deleteTestimonialComment(input: DeleteTestimonialCommentInput!): TestimonialComment
  }
`;

export default TestimonialCommentSchema;