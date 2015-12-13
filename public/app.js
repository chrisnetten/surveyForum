/// <reference path="_reference.ts" />
var mainModuleName = "app";
var app = angular.module(mainModuleName, []);
//# sourceMappingURL=app.js.map


app.config(['$routeProvider',function ($routeProvider){
	$routeProvider
		.when('/index', {
			templateUrl: 'views/SurveyList.html',
			controller: 'SurveyListcontroller'
		})
		.when('/survey/:id',{
			templateUrl: 'views/index.ejs',
			controller: 'SurveyController'
		})
		.otherwise({
			redirectTo: '/index'
		});
}]);

app.controller('SurveyListcontroller', ['$scope', function ($scope) {
	    $scope.surveys = surveys;

	    $scope.delete = function(index){
	      $scope.surveys.splice(index,1);
	    }
}]);

app.controller('SurveyController',['$scope','$routeParams','$location', function($scope, $routeParams, $location){
	var surveyId = +$routeParams.id ;
	
	$scope.categories = [
		{id:1, name:"eMail Based"},
		{id:2, name:"Online"},
		{id:3, name:"SMS Based"}
	];

	var survey = _.find(surveys, { 'id': surveyId });
	$scope.survey = angular.copy(survey);

	$scope.save = function(){
		$scope.survey = angular.copy($scope.survey, survey);
		$location.path('/index');
	}

	$scope.cancel = function(){
		$location.path('/index');
	}
}])