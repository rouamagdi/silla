import { gql } from 'apollo-server-express';

/**
 * Post schema
 */
const AccessSchema = gql`
  type Access {
    id: ID
    operation: AccessOperation!
    members: [User!]! @relation(name: "AccessMembers")
    posts: [Post!]! @relation(name: "AccessPosts")
    postLikes: [PostLike!]! @relation(name: "AccessPostLikes")
    postComments: [PostComment!]! @relation(name: "AccessPostComments")
    messages: [Message!]! @relation(name: "AccessMessages")
    donations: [Donation!]! @relation(name: "AccessDonations")
    donationLikes: [DonationLike!]! @relation(name: "AccessDonationLikes")
    donationComments: [DonationComment!]! @relation(name: "AccessDonationComments")
    invitations: [Invitation!]! @relation(name: "AccessInvitations")
    invitationLikes: [InvitationLike!]! @relation(name: "AccessInvitationLikes")
    invitationComments: [InvitationComment!]! @relation(name: "AccessInvitationComments")
    testimonials: [Testimonial!]! @relation(name: "AccessTestimonials")
    testimonialLikes: [TestimonialLike!]! @relation(name: "AccessTestimonialLikes")
    testimonialComments: [TestimonialComment!]! @relation(name: "AccessTestimonialComments")
    followers: [Follow!]! @relation(name: "AccessFollowers")
    fakeMambers: [FakeMamber!]! @relation(name: "AccessFakeMambers")
    photoAlbums: [PhotoAlbum!]! @relation(name: "AccessPhotoAlbum")
    familys: [Family!]! @relation(name: "AccessFamilys")
    profiles: [Profile!]! @relation(name: "AccessProfile")
    memorys: [Memory!]! @relation(name: "AccessMemorys")
    groups: [Group!]! @relation(name: "AccessGroup")
    trees: [Tree!]! @relation(name: "AccessTree")
  }
`;

export default AccessSchema;