/// <reference path="_reference.ts" />
(function () {
    var mainModuleName = "app";
    var app = angular.module(mainModuleName, ['ngRoute', 'ngResource']);
    //wait until the document loads
    angular.element(document).ready(function () {
        // manually boostrap angular 
        angular.bootstrap(document, [mainModuleName]);
    });

  app.controller('StoreController', ['$http', function($http){
    var store = this;
    store.products = [];
    $http.get('./store-products.json').success(function(data){
        store.products = data;
    });
  }]);

  app.controller('ReviewController', function() {
    this.review = {};

    this.addReview = function(product) {
      product.reviews.push(this.review);

      this.review = {};
    };
  });
})();