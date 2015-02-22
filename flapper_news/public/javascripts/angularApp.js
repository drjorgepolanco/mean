var app = angular.module('flapperNews', ['ui.router']);

app.config([
  '$stateProvider', 
  '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts) {
            return posts.getAll();
          }]
        }
      })
      .state('posts', {
        url: '/posts/:id',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);

// Create a factory for posts
// by exporting an object that contains the posts array we can add new objects 
// and methods to our services in the future
app.factory('posts', ['$http', function($http) {
  var o = {
    posts: []
  };

  // Display all posts
  o.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, o.posts);
    });
  };

  // Create new Post
  o.create = function(post) {
    return $http.post('/posts', post).success(function(data) {
      o.posts.push(data);
    });
  };

  // Upvote a post
  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote')
      .success(function(data) {
        post.votes += 1;
      });
  };

  // Downvote a post
  o.downvote = function(post) {
    return $http.put('/posts/' + post._id + '/downvote')
      .success(function(data) {
        post.votes -= 1;
      });
  };

  // Get a single post
  o.get = function(id) {
    // Instead of success(), we are using a promise here: then()
    return $http.get('/posts/' + id).then(function(res) {
      return res.data;
    });
  };

  // Add a comment to a post
  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };

  // Upvote comments
  o.upvoteComment = function (post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
      .success(function (data) {
        comment.votes += 1;
      });
  };

  // Downvote comments
  o.downvoteComment = function (post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote')
      .success(function (data) {
        comment.votes -= 1;
      });
  };

  return o;
}]);

//              Injecting the Service ⇘ ⇘ ⇘
app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {

  $scope.posts = posts.posts;

  // Save posts to the server
  $scope.addPost = function() {
    if ($scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link
    });
    $scope.title = '';
    $scope.link  = '';
  };

  $scope.upvote = function(post) {
    // store the new vote
    posts.upvote(post);
  };

  $scope.downvote = function(post) {
    // store the new vote
    posts.downvote(post);
  }; 
}]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', function($scope, posts, post) {
  $scope.post = post;

  $scope.addComment = function() {
    if ($scope.body === '') { return; }
    posts.addComment(post._id, {
      body: $scope.body,
      author: 'user'
    }).success(function(comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };

  $scope.upvote = function (comment) {
    posts.upvoteComment(post, comment);
  };

  $scope.downvote = function (comment) {
    posts.downvoteComment(post, comment);
  };
}]);
