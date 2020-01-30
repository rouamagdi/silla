import { gql } from 'apollo-server-express';

/**
 * Like schema
 */
const TestimonialLikeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type TestimonialLike @model{
    id: ID! @isUnique
    testimonial: ID!
    author: [ID!]! @relation(name: "TestimonialLikeOwner")
    access: [Access!]! @relation(name: "AccessTestimonialLikes")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateTestimonialLikeInput {
    authorId: ID!
    testimonialId: ID!
  }

  input DeleteTestimonialLikeInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type TestimonialLikePayload {
    id: ID!
    testimonial: TestimonialPayload
    authorId: UserPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a like for testimonial
    createTestimonialLike(input: CreateTestimonialLikeInput!): TestimonialLike

    # Deletes a testimonial like
    deleteTestimonialLike(input: DeleteTestimonialLikeInput!): TestimonialLike
  }
`;

export default TestimonialLikeSchema;