// import Message Resolver
import messageResolver from './Message';
import notificationChatResolver from './Message/notification';

// import Donation Resolver
import donationResolver from './Donation/donation';
import likeDonationResolver from './Donation/like';
import commentDonationResolver from './Donation/comment';
// import notificationDonationResolver from './Donation/notification';

// import Follow Resolver
import followResolver from './Follow/follow';

// import Family Resolver
import familyResolver from './Family/Family';


// import FakeMamber Resolver
import FakeMamberResolver from './FakeMamber/FakeMamber';

// import Invitation Resolver
import invitationResolver from './Invitation/invitation';
import likeInvitationResolver from './Invitation/like';
import commentInvitationResolver from './Invitation/comment';
// import notificationInvitationResolver from './Invitation/notification';

// import Memory Resolver
import memoryResolver from './Memory/memory';
import likeMemoryResolver from './Memory/like';
import commentMemoryResolver from './Memory/comment';
// import notificationMemoryResolver from './Memory/notification';

// import Post Resolver
import postResolver from './Post/post';
import likePostResolver from './Post/like';
import commentPostResolver from './Post/comment';
// import notificationPostResolver from './Post/notification';

// import Testimonial Resolver
import TestimonialResolver from './Testimonial/testimonial';
import likeTestimonialResolver from './Testimonial/like';
import commentTestimonialResolver from './Testimonial/comment';
// import notificationTestimonialResolver from './Testimonial/notification';

// import Tree Resolver
import treeResolver from './Tree/tree';

// import group Resolver
import groupResolver from './Group/group';

// import user Resolver
import userResolver from './User/user';

// import profile Resolver
import profileResolver from './Profile/profile';

// import profile Resolver
import photoAlbumResolver from './PhotoAlbum/photoAlbum';

export default [
  messageResolver,
  // notificationChatResolver,
  donationResolver,
  likeDonationResolver,
  commentDonationResolver,
  // notificationDonationResolver,
  followResolver,
  familyResolver,
  FakeMamberResolver,
  invitationResolver,
  likeInvitationResolver,
  commentInvitationResolver,
  // notificationInvitationResolver,
  memoryResolver,
  likeMemoryResolver,
  commentMemoryResolver,
  // notificationMemoryResolver,
  postResolver,
  likePostResolver,
  commentPostResolver,
  // notificationPostResolver,
  TestimonialResolver,
  likeTestimonialResolver,
  commentTestimonialResolver,
  // notificationTestimonialResolver,
  treeResolver,
  groupResolver,
  profileResolver,
  photoAlbumResolver,
  userResolver
];
