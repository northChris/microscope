Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  // waitOn:function() {
  //   return [Meteor.subscribe("posts"), Meteor.subscribe('comments')];}
});

Router.route('/',{name: 'postsList'});

Router.route('/post/:_id', {
  name: 'postPage',
  data: function() { return Post.findOne(this.params._id);}
});

Router.route('/posts/:_id/edit',{
  name:'postPage',
  data: function() { return posts.findOne(this.params._id);}
});

Router.route('/submit', {name: 'postSubmit'});

var requireLogin = function() {
  if (! meteor.user()) {
    if (Meteor.loggingin()){
      this.render(this.loadingtemplate);
    }else{
    this.render('accessDenied');
    }
  }else{
    this.next();
  }
};
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
// The special :_id syntax tells the router two things:
// first, to match any route of the form /posts/xyz/ ,
//  where “xyz” can be anything at all. Second,
//  to put whatever it finds in this “xyz” spot inside
//  an _id property in the router’s params array.
// Router.onBeforeAction('dataNotFound', {only: 'postPage'});
