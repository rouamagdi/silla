import { gql } from 'apollo-server-express';

/**
 * Testimonial schema
 */
const TestimonialSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Testimonial @model{
    id: ID! @isUnique
    tree: ID
    group: ID
    author: [ID!]! @relation(name: "TestimonialOwner")
    image: File
    question: String!
    options: [Option]
    voted: Number
    likes: [TestimonialLike]
    comments: [TestimonialComment]
    access: [Access!]! @relation(name: "AccessTestimonials")
    createdAt: Date
    dateTo: Date
  }

  type Option {
    id: ID!
    option: String!
    votes: Number!
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input OptionInput{
    option: String
    votes: Number
  }
  
  input CreateTestimonialInput {
    question: String
    options: [OptionInput]
  	voted: Number
    image: Upload
    imagePublicId: String
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input DeleteTestimonialInput {
    id: ID!
    imagePublicId: String
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type TestimonialPayload {
    id: ID!
    question: String!
    options: OptionPayload
    voted: Number
    author: ID!
    likes: [TestimonialLikePayload]
    comments: [TestimonialCommentPayload]
    tree: ID
    group: ID
    createdAt: Date
    dateTo: Date
  }

  type OptionPayload{
    option: String
    votes: Number
  }
  
  type TestimonialsPayload {
    testimonials: [TestimonialPayload]!
    count: String!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets all tree testimonial
    getTestimonials(authUserId: ID!, skip: Int, limit: Int): TestimonialsPayload

    # Gets testimonial by id
    getTestimonial(id: ID!): TestimonialPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
   # Creates a new testimonial
    createTestimonial(input: CreateTestimonialInput!): TestimonialPayload
    # Creates a new vote
    voteOnTestimonial(optionId: ID!): TestimonialPayload
    # Deletes a user testimonial
    deleteTestimonial(input: DeleteTestimonialInput!): TestimonialPayload
  }
 
  extend type Subscription {
    testimonialCreated: TestimonialPayload
    optionVoted: Option
  }
`;

export default TestimonialSchema;