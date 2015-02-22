var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
      url: '/posts/{id}', // 'id' is a route parameter that will be made available to our controller
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]);

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
        post.upvotes += 1;
      });
  };

  return o;
}]);

//              Injecting the Service ⇘ ⇘ ⇘
app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
  $scope.test = 'Hello World!';
  
  $scope.posts = posts.posts;

  // Save posts to the server
  $scope.addPost = function() {
    if ($scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link  = '';
  };

  $scope.incrementUpvotes = function(post) {
    // store the new vote
    posts.upvote(post);
  }; 
}]);

app.controller('PostsCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts) {
  $scope.post = posts.posts[$stateParams.id];

  $scope.addComment = function() {
    if ($scope.body === '') { return; }
    $scope.post.comments.push({
      body: $scope.body,
      author: 'user',
      upvotes: 0
    });
    $scope.body = '';
  };

  $scope.incrementUpvotes = function(comment) {
    comment.upvotes += 1;
  }; 
}]);























