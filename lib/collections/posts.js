Posts = new Mongo.Collection('posts');

Posts.allow({
  update:function(userId, post) {return ownsDocument(userId, post); },
  remove:function(userId, post) {return ownsDocument(userId, post); },
});
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
  return errors.title || errors.url;
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(meteor.userId(), String);
    check(postAttributes,{
      title: string,
      url: String
    });

    validatePost = function(post) {
      var errors = {};

      if (!post.title)
        errors.title = "please fill in a headline";

      if (!post.url)
        errors.url = "please fill in a URL";

      return errors;
    };

    if (meteor.isServer) {
      postAttributes.title += "(server)";
      // wait for 5 seconds
      Meteor._sleepForMs(5000);
    }else{
      postAttributes.title += "(clients)";
    }

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink){
      return{
        postExists: true,
        _id: postWithSameLink._id
      };
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._Id,
      author: user.username,
      submitted: new Date()
    });
    var postId = Post.insert(post);

    return{
      _id:postId
    };
  }
});
// Posts.allow({
//   insert: function(userId, doc) {
//     // only allow posting if you are logged in
//     return !! userId;
//   }
// });
