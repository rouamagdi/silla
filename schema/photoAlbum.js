import { gql } from 'apollo-server-express';

/**
 * PhotoAlbum schema
 */
const PhotoAlbumSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type PhotoAlbum @model{
    id: ID! @isUnique
    image: File
    text: String
    memory: Memory!
    tree: Tree!
    author: [User!]! @relation(name: "PhotoAlbumOwner")
    access: [Access!]! @relation(name: "AccessPhotoAlbum")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreatePhotoAlbumInput{
    id: ID
    image: Upload
    text: String
    memoryId: ID!
    treeId: ID!
    authorId: ID!
    createdAt: Date
  }
  
  input DeletePhotoAlbumInput{
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
 
  type PhotoAlbumPayload{
    id: ID!
    image: File
    text: String
    memory: Memory!
    tree: TreePayload!
    author: UserPayload!
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    #Gets PhotoAlbum
    getPhotoAlbum(authorId: ID!, skip: Int, limit: Int): PhotoAlbumPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new PhotoAlbum
    createPhotoAlbum(input: CreatePhotoAlbumInput!): PhotoAlbumPayload
    # Deletes a user PhotoAlbum
    deletePhotoAlbum(input: DeletePhotoAlbumInput!): PhotoAlbumPayload
  }
`;

export default PhotoAlbumSchema;