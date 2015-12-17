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
            return $resource('/survey/:id', null, {
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
                if (!$scope.newSurvey || $scope.newSurvey.length < 1) {
                    return;
                }
                var survey = new Survey({ name: $scope.newSurvey, username: $scope.username, completed: false });
                survey.$save(function () {
                    $scope.survey.push(survey);
                    $scope.newSurvey = ''; // clear textbox
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
            $scope.remainingSurvey = function () {
                var count = 0;
                angular.forEach($scope.survey, function (survey) {
                    count += survey.completed ? 0 : 1;
                });
                return count;
            };
            $scope.totalSurvey = function () {
                var count = 0;
                angular.forEach($scope.survey, function (survey) {
                    count++;
                });
                return count;
            };
        }]);
    app.config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                templateUrl: '/survey.html',
                controller: 'SurveyController'
            })
                .when('/:id', {
                templateUrl: '/surveyDetails.html',
                controller: 'SurveyDetailCtrl'
            });
        }]);
})();
//# sourceMappingURL=app.js.map