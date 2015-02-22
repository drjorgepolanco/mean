var mongoose = require('mongoose');
var express  = require('express');

var router   = express.Router();
var Post     = mongoose.model('Post');
var Comment  = mongoose.model('Comment');

/* root: GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* index: List all Posts */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err); }
    res.json(posts);
  });
});

/* Create a new Post */
router.post('/posts', function(req, res, next) {
  // new
  var post = new Post(req.body);

  // create
  post.save(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

/* Preload a Single Post */ // this func will run *1
// This middleware retrieves the post and attaches it to the req object... (see next)
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

/* Show the Single Post */ // when we call this *1
// then this returns the JSON back to the client
// router.get('/posts/:post', function(req, res) {
//   res.json(req.post);
// });

/* Retrieve comments along with posts */
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

/* Upvote on a Post */
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

/* Downvote on a Post */
router.put('/posts/:post/downvote', function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

/* Create comments route for a particular post */
router.post('/posts/:post/comments', function(req, res, next) {
  // new
  var comment = new Comment(req.body);
  comment.post = req.post;

  // create
  comment.save(function(err, comment) {
    if (err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if (err) { return nex(err); }

      res.json(comment);
    });
  });
});

/* Upvote on a Comment */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

/* Downvote on a Comment */
router.put('/posts/:post/comments/:comment/downvote', function(req, res, next) {
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
