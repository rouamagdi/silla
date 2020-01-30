import { gql } from 'apollo-server-express';

/**
 * Post schema
 */
const PostSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Post @model{
    id: ID! @isUnique
    tree: ID
    group: ID
    author: ID! @relation(name: "PostOwner")
    text: String
    image: File
    likes: [PostLike]
    comments: [PostComment]
    access: [Access!]! @relation(name: "AccessPosts")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreatePostInput {
    text: String
    image: Upload
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input DeletePostInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type PostPayload {
    id: ID!
    text: String
    image: File
    imagePublicId: String
    author: ID
    likes: [PostLikePayload]
    comments: [PostCommentPayload]
    tree: ID
    group: ID
    createdAt: Date
  }

  type PostsPayload {
    posts: [PostPayload]!
    count: String!
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
   # Gets all tree Post
   getPosts(authUserId: ID!, skip: Int, limit: Int): PostsPayload
    # Gets Post by id
    getPost(id: ID!): PostPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new Post
    createPost(input: CreatePostInput!): PostPayload
    # Deletes a user invitation
    deletePost(input: DeletePostInput!): PostPayload
  }
`;

export default PostSchema;