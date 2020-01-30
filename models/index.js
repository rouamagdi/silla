//Achievement models
import Achievement from './Achievement/achievement';

//User models
import User from './User/User';

//Profile models
import Profile from './Profile/profile';

//PhotoAlbum models
import PhotoAlbum from './PhotoAlbum/photoAlbum';

//Follow models
import Follow from './Follow/Follow';

//Message models
import Message from './Message';

//Donation models
import Donation from './Donation/Donation';
import donationLike from './Donation/Like';
import donationComment from './Donation/Comment';
import donationNotification from './Donation/Notification';

//Memory models
import Memory from './Memory/Memory';
import memoryLike from './Memory/Like';
import memoryComment from './Memory/Comment';
import memoryNotification from './Memory/Notification';

//Invitation models
import Invitation from './Invitation/Invitation';
import invitationLike from './Invitation/Like';
import invitationComment from './Invitation/Comment';
import invitationNotification from './Invitation/Notification';

//Post models
import Post from './Post/Post';
import postLike from './Post/Like';
import postComment from './Post/Comment';
import postNotification from './Post/Notification';

//Testimonial models
import Testimonial from './Testimonial/Testimonial';
import testimonialLike from './Testimonial/Like';
import testimonialComment from './Testimonial/Comment';
import testimonialNotification from './Testimonial/Notification';

//Tree models
import Tree from './Tree/Tree';
import treeNotification from './Tree/Notification';

//Group models
import Group from './Group/Group';
import groupNotification from './Group/Notification';


//FakeMamber models
import FakeMamber from './FakeMamber/FakeMamber';

export default {
  Achievement,
  User,
  Follow,
  FakeMamber,
  Message,
  Donation,
  donationLike,
  donationComment,
  donationNotification,
  Group,
  groupNotification,
  Memory,
  memoryLike,
  memoryComment,
  memoryNotification,
  Invitation,
  invitationLike,
  invitationComment,
  invitationNotification,
  Post,
  postLike,
  postComment,
  postNotification,
  Profile,
  PhotoAlbum,
  Testimonial,
  testimonialLike,
  testimonialComment,
  testimonialNotification,
  Tree,
  treeNotification,
};
