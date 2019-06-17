var dbmonJSApp = angular.module('atlmonJSApp', [ 'ngRoute', 'atlmonJSControllers',
  'atlmonJSDirectives', 'atlmonJSServices', 'angular.filter',
  'smart-table','ui.bootstrap', 'ngMaterialDatePicker', 'ngMaterial' , 'treeGrid', 'ngSanitize']);

dbmonJSApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.
    when('/home', {
      templateUrl: 'partials/dash.html',
    }).
    when('/db/:currentDB', {
      templateUrl: 'partials/db-details.html',
      reloadOnSearch: false
    }).
    when('/db/:currentDB/jobs', {
      templateUrl: 'partials/jobs-details.html',
      reloadOnSearch: false
    }).
    when('/performance-history', {
      templateUrl: 'partials/db-performance.html',
    }).
    when('/db/:currentDB/sql_id=:sqlId', {
      templateUrl: 'partials/sql-details.html',
    }).
    when('/app/search', {
      templateUrl: 'partials/any-app.html'
    }).
    when('/app', {
      templateUrl: 'partials/app-details.html',
      reloadOnSearch: false
    }).
    when('/sessions', {
      templateUrl: 'partials/all-sessions-details.html',
    }).
    when('/blocking-tree', {
      templateUrl: 'partials/hist-blocking-tree.html',
      reloadOnSearch: false
    }).
    otherwise({
      redirectTo: '/home'
    });
} ]);

dbmonJSApp.config(function($mdThemingProvider) {
  var monGreenMap = $mdThemingProvider.extendPalette('green', {
    '500': '#229369',
    'contrastDefaultColor': 'dark'
  });
  // Register the new color palette map
  $mdThemingProvider.definePalette('monGreen', monGreenMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('monGreen');
});

// restores URL-behaviour after updating Angular from 1.5.8 to 1.7.3
dbmonJSApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

// prevent angulajs add "unsafe:javascript:void(0)" to links.
// This was detected when using  Smart Tables (st-pagination)
dbmonJSApp.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
}]);