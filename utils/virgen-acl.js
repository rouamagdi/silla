// Load library
var Acl = require("virgen-acl").Acl
  , acl = new Acl();
// Set up roles
acl.addRole("member", "supervisor");      // member inherits permissions from supervisor
acl.addRole("supervisor","admin");        // supervisor inherits permissions from admin
acl.addRole("admin");                     // Admin inherits from no one

// Set up resources
acl.addResource("tree");                  // tree resource, inherits no resources
acl.addResource("follow");                // follow resource, inherits no resources
acl.addResource("chat");                  // chat resource, inherits no resources
acl.addResource("message");               // chat resource, inherits no resources
acl.addResource("donation");              // donation resource, inherits no resources
acl.addResource("donationLike");          // donation resource, inherits no resources
acl.addResource("donationComment");              // donation resource, inherits no resources
acl.addResource("invitation");            // invitation resource, inherits no resources
acl.addResource("invitationLike");        // invitation resource, inherits no resources
acl.addResource("invitation");            // invitation resource, inherits no resources
acl.addResource("memory");                // memory resource, inherits no resources
acl.addResource("memoryLike");            // memory resource, inherits no resources
acl.addResource("memory");                // memory resource, inherits no resources
acl.addResource("post");                  // post resource, inherits no resources
acl.addResource("postLike");              // post resource, inherits no resources
acl.addResource("post");                  // post resource, inherits no resources
acl.addResource("testimonial");           // testimonial resource, inherits no resources
acl.addResource("testimonialLike");       // testimonial resource, inherits no resources
acl.addResource("testimonial");           // testimonial resource, inherits no resources
acl.addResource("user");                  // user resource, inherits no resources


// Set up access rules (LIFO)
acl.deny();                               // deny all by default
acl.allow("admin");                       // allow admin access to everything
acl.allow("admin","supervisor");                       
acl.allow("supervisor","fmember");                  // allow supervisor access to sup-thing 
acl.allow(["supervisor", "member"], "tree", [ "follow", "chat", "donation","invitation", "post", "testimonial"]);   // allow members follow, chat, donation, invitation, memory, post, testimonial on tree
acl.allow(["supervisor", "member"], "chat", "message");   // allow members follow, chat, donation, invitation, memory, post, testimonial on tree
acl.allow(["supervisor", "member"], "donation", [ "donationLike","donationComment", "donationNotification"]);   // allow members follow, chat, donation, invitation, memory, post, testimonial on tree
acl.allow(["supervisor", "member"], "invitation", [ "invitationLike", "invitationComment", "invitationNotification"]);   // allow members follow, chat, donation, invitation, memory, post, testimonial on tree
acl.allow(["supervisor", "member"], "memory", [ "memoryLike", "memoryComment", "memoryNotification"]);   // allow members follow, chat, donation, invitation, memory, post, testimonial on tree
acl.allow(["supervisor", "member"], "post", [ "postLike", "postComment", "postNotification"]);   // allow members follow, chat, donation, invitation, memory, post, testimonial on tree
acl.allow(["supervisor", "member"], "testimonial", [ "testimonialLike", "testimonialComment", "testimonialNotification"]);   // allow members follow, chat, donation, invitation, memory, post, testimonial on tree

// Query the ACL
acl.query([ "supervisor", "member"], "tree", [ "follow", "chat", "donation","invitation", "memory", "post", "testimonial"], function(err, allowed) {
  if (allowed) {
    // commenting allowed!
  } else {
    // no commenting allowed!
  }
});

// supports multiple roles in query
acl.query(["member", "supervisor"], ["member", "fmember" ,"tree" , "follow", "chat", "donation","invitation", "memory", "post", "testimonial"], ["create", "view", "destroy"], function(err, allowed) {
    if (allowed) {
      // creating allowed!
    } else {
      // no creating allowed!
    }
});

// supports multiple roles in query
acl.query("admin", "supervisor" ["create", "view", "destroy"], function(err, allowed) {
  if (allowed) {
    // creating allowed!
  } else {
    // no creating allowed!
  }
});
acl.allow("member", "blog", "edit", function(err, role, resource, action, result, next) {
  // Use next() if unable to determine permission based on provided arguments
  if (!(role instanceof User) || !(resource instanceof Blog))
    return next();

  if (role.id == resource.user_id) {
    // resource belongs to this role, allow editing
    result(null, true);
  } else {
    // resource does not belong to this role, do not allow editing
    result(null, false);
  }
});

var userA = new User({id: 123});
assert(userA.id == 123);
var userB = new User({id: 456});
assert(userB.id == 456);
var blog = new Blog({user_id: 123});
assert(blog.user_id == 123);

// userA can edit this blog because the blog's user ID matches the userA's ID
acl.query(userA, blog, 'edit', function(err, allowed) {
  assert(allowed == true);
});

// However userB cannot edit this blog
acl.query(userB, blog, 'edit', function(err, allowed) {
  assert(allowed == false);
});
module.exports = virgen;