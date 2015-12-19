/// <reference path="_reference.ts" />
(function () {
    var mainModuleName = "app";
    var app = angular.module(mainModuleName, ['ngRoute', 'ngResource']);
    //wait until the document loads
    angular.element(document).ready(function () {
        // manually boostrap angular 
        angular.bootstrap(document, [mainModuleName]);
    });
    
    app.factory('Survey', ['$resource', function ($resource) {
            return $resource('/survey/:id',null, {
                'update': { method: 'PUT' }
            });
        }]);

    
     app.controller('SurveyController', ['$scope', 'Survey', function ($scope, Survey) {
            $scope.editing = [];
            $scope.username = '';
         
            $scope.userSurvey = [];
            $scope.setUserName = function (userName) {
                $scope.username = userName; //get the username
                $scope.survey = Survey.query(function () {
                    $scope.userSurvey = []; // reset the userTodos array
                    $scope.survey.forEach(function (survey) {
                        
                        
                            $scope.userSurvey.push(survey);
                        
                    });
                    $scope.survey = $scope.userSurvey;
                });
            };
            $scope.save = function () {
                if (!$scope.newSurvey , !$scope.newQuestion, !$scope.newDescription|| $scope.newSurvey.length < 1, $scope.newQuestion.length < 1, $scope.newDescription.length < 1) {
                    return;
                }
                var survey = new Survey({ name: $scope.newSurvey, question: $scope.newQuestion, description: $scope.newDescription,username: $scope.username, completed: false });
                survey.$save(function () {
                    $scope.survey.push(survey);
                    $scope.newSurvey = '';
                    $scope.newQuestion = ''; // clear textbox
                    $scope.newDescription = '';
                });
            };
            $scope.update = function (index) {
                var survey = $scope.survey[index];
                Survey.update({ id: survey._id }, survey);
                $scope.editing[index] = false;
            };
            $scope.edit = function (index) {
                
                $scope.editing[index] = angular.copy($scope.survey[index]);
                
            };
            $scope.cancel = function (index) {
                $scope.survey[index] = angular.copy($scope.editing[index]);
                $scope.editing[index] = false;
            };
            $scope.remove = function (index) {
                var survey = $scope.survey[index];
                Survey.remove({ id: survey._id }, function () {
                    $scope.survey.splice(index, 1);
                });
                $scope.editing[index] = false;
            };
           
            $scope.totalSurvey = function () {
                var count = 0;
                angular.forEach($scope.survey, function (survey) {
                   
                        count++;
                    
                });
                return count;
            };
        }]);
        
       
        

         
     app.controller('AnswerController', function(survey) {
         this.answer = {};

         this.addAnswer = function(product) {
             survey.answer.push(this.survey);
             this.answer = {};
         };
     });

     app.controller('TabController', function() {
         this.tab = 1;

         this.setTab = function(newValue) {
             this.tab = newValue;
         }

         this.isSet = function(tabName) {
             return this.tab === tabName;
         };
         
     });
         
        
         app.controller('SurveyDetailCtrl', ['$scope', '$routeParams', 'Survey', '$location',
        function($scope, $routeParams, Survey, $location) {
            $scope.survey = Survey.get({ id: $routeParams.id });

            $scope.update = function() {
                Survey.update({ id: $scope.survey_id }, $scope.survey, function() {
                    $location.url('/');
                });
            }

            $scope.remove = function() {
                Survey.remove({ id: $scope.survey._id }, function() {
                    $location.url('/');
                });
            }

            $scope.cancel = function() {
                $location.url('/');
            }
            
              
        }]);

  app.config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                templateUrl: '/survey.html',
                controller: 'SurveyController'
            })
                .when('/:id', {
                templateUrl: '/surveyDetails.html',
                controller: 'SurveyDetailCtrl' ,
                
            })
                .when('/userSurvey', {
                templateUrl: '/userSurvey.html',
                controller: 'SurveyController' ,
            });
        }]);
})();