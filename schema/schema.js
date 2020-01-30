import { gql } from 'apollo-server-express';

import AccessSchema from './Access';
import AchievementSchema from './Achievement';
import DonationSchema from './Donation';
import DonationCommentSchema from './DonationComment';
import DonationLikeSchema from './DonationLike';
import FakeMamberSchema from './FakeMamber';
import FamilySchema from './Family';
import FollowSchema from './Follow';
import GroupSchema from './Group';
import InvitationSchema from './Invitation';
import InvitationCommentSchema from './InvitationComment';
import InvitationLikeSchema from './InvitationLike';
import MemorySchema from './Memory';
import MemoryCommentSchema from './MemoryComment';
import MemoryLikeSchema from './MemoryLike';
import MessageSchema from './Message';
import photoAlbumSchema from './photoAlbum';
import PostSchema from './Post';
import PostCommentSchema from './PostComment';
import PostLikeSchema from './PostLike';
import ProfileSchema from './Profile';
import TestimonialSchema from './Testimonial';
import TestimonialCommentSchema from './TestimonialComment';
import TestimonialLikeSchema from './TestimonialLike';
import TreeSchema from './Tree';


// import NotificationSchema from './Notification';
import UserSchema from './User';

const schema = gql`
   # ---------------------------------------------------------
  # Custom scalars 
  # ---------------------------------------------------------
  scalar Date
  scalar Number

   # ---------------------------------------------------------
  # Custom directive 
  # ---------------------------------------------------------
  directive @relation(name: String) on OBJECT | FIELD_DEFINITION 
  directive @model  on OBJECT 
  directive @isUnique(id: ID) on FIELD_DEFINITION
   # ---------------------------------------------------------
  # Custom  enums
  # ---------------------------------------------------------
  enum notificationType {
    CHAT
    FOLLOW
    LIKE
    COMMENT
    DONATION
    POST
    INVITATION
    TESTIMONIAL
  }
    enum UserRole {
    EDITOR,
    MODERATOR,
    ADMIN
  }
  enum AccessOperation {
    READ,
    UPDATE,
    DELETE
  }
   # ---------------------------------------------------------
  # Objects
  # ---------------------------------------------------------
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  # ---------------------------------------------------------
  # Query Root
  # ---------------------------------------------------------
  type Query {
    _empty: String
  }
  # ---------------------------------------------------------
  # Mutation Root
  # ---------------------------------------------------------
  type Mutation {
    _empty: String
  }
  # ---------------------------------------------------------
  # Subscription Root
  # ---------------------------------------------------------
  type Subscription {
    _empty: String
  }
  # ---------------------------------------------------------
  # Exported Schema
  # ---------------------------------------------------------
  ${AccessSchema}
  ${AchievementSchema}
  ${DonationSchema}
  ${DonationCommentSchema}
  ${DonationLikeSchema}
  ${FakeMamberSchema}
  ${FamilySchema}
  ${FollowSchema}
  ${GroupSchema}
  ${InvitationSchema}
  ${InvitationCommentSchema}
  ${InvitationLikeSchema}
  ${MemorySchema}
  ${MemoryCommentSchema}
  ${MemoryLikeSchema}
  ${MessageSchema}
  ${photoAlbumSchema}
  ${PostSchema}
  ${PostCommentSchema}
  ${PostLikeSchema}
  ${ProfileSchema}
  ${TestimonialSchema}
  ${TestimonialCommentSchema}
  ${TestimonialLikeSchema}
  ${TreeSchema}
  ${UserSchema}
`;

export default schema;