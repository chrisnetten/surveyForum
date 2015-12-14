/// <reference path="_reference.ts" />
(function () {
    var mainModuleName = "app";
    var app = angular.module(mainModuleName, ['ngRoute', 'ngResource']);
    //wait until the document loads
    angular.element(document).ready(function () {
        // manually boostrap angular 
        angular.bootstrap(document, [mainModuleName]);
    });
    
    
    app.factory('Poll', ['$resource', function ($resource) {
            return $resource('/polls/:pollId', null, {
                'query': { method: 'GET',params: { pollId: 'polls' }, isArray: true }
            });
        }]);

    // Controllers +++++++++++++++++++++++++++++++++++++++++++++++
     app.controller('PollListCtrl', ['$scope', 'Poll',
        function ($scope, Poll) {
     $scope.polls = Poll.query();
        }]);

     
     app.controller('PollItemCtrl', ['$scope', '$routeParams', 'Poll', 'socket',
        function ($scope, $routeParams, Poll, socket) {
            
            $scope.poll = Poll.get({pollId: $routeParams.pollId});
	
	socket.on('myvote', function(data) {
		console.dir(data);
		if(data._id === $routeParams.pollId) {
			$scope.poll = data;
		}
	});
	
	socket.on('vote', function(data) {
		console.dir(data);
		if(data._id === $routeParams.pollId) {
			$scope.poll.choices = data.choices;
			$scope.poll.totalVotes = data.totalVotes;
		}		
	});
	
	$scope.vote = function() {
		var pollId = $scope.poll._id,
				choiceId = $scope.poll.userVote;
		
		if(choiceId) {
			var voteObj = { poll_id: pollId, choice: choiceId };
			socket.emit('send:vote', voteObj);
		} else {
			alert('You must select an option to vote for');
		}}
            
        }]);

app.controller('PollNewCtrl', ['$scope', '$location', 'Poll',
        function ($scope, $location, Poll) {
            $scope.poll = {
		question: '',
		choices: [ { text: '' }, { text: '' }, { text: '' }]
	};
	
	// Method to add an additional choice option
	$scope.addChoice = function() {
		$scope.poll.choices.push({ text: '' });
	};
	
	// Validate and save the new poll to the database
	$scope.createPoll = function() {
		var poll = $scope.poll;
		
		// Check that a question was provided
		if(poll.question.length > 0) {
			var choiceCount = 0;
			
			// Loop through the choices, make sure at least two provided
			for(var i = 0, ln = poll.choices.length; i < ln; i++) {
				var choice = poll.choices[i];
				
				if(choice.text.length > 0) {
					choiceCount++
				}
			}
		
			if(choiceCount > 1) {
				// Create a new poll from the model
				var newPoll = new Poll(poll);
				
				// Call API to save poll to the database
				newPoll.$save(function(p, resp) {
					if(!p.error) {
						// If there is no error, redirect to the main view
						$location.path('polls');
					} else {
						alert('Could not create poll');
					}
				});
			} else {
				alert('You must enter at least two choices');
			}
		} else {
			alert('You must enter a question');
		}}
        }]);

  // Routes ++++++++++++++++++++++++++++++++++++++++++++++++++++++
    app.config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                templateUrl: '/list.html',
                controller: 'PollListCtrl'
            })
                .when('/:pollId', {
                templateUrl: '/item.html',
                controller: 'PollItemCtrl'
                })
                .when('/new', {
                    templateUrl : '/new.html',
                    contrller: 'PollNewCtrl'
                    
                })
                .otherwise ({
                    redirectTo: '/index'
                });
        }]);
});