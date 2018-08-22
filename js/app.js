var dbmonJSApp = angular.module('atlmonJSApp', [ 'ngRoute', 'atlmonJSControllers',
  'atlmonJSDirectives', 'atlmonJSServices', 'atlmonJSFilters', 'angular.filter',
  'smart-table','ui.bootstrap', 'ngMaterialDatePicker', 'ngMaterial' , 'treeGrid']);

dbmonJSApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.
    when('/home', {
      templateUrl: 'partials/dash.html',
    }).
    when('/db/:currentDB', {
      templateUrl: 'partials/db-details.html',
      reloadOnSearch: false
    }).
    when('/history', {
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
    when('/hist-blocking-tree', {
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

//Needed to add this after accidently updating Angularfrom 1.5.8 to 1.7.3 o_O
dbmonJSApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);