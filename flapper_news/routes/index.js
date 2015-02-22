var express  = require('express');
var router   = express.Router();

var mongoose = require('mongoose');
var Post     = mongoose.model('Post');
var Comment  = mongoose.model('Comment');

/* root: GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* index: List all Posts */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err); }
    res.json(posts);
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

/* Show the Single Post */ // when we call this *1
// then this returns the JSON back to the client
router.get('/posts/:post', function(req, res) {
  res.json(req.post);
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

/* Vote on a Post */
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});





module.exports = router;
