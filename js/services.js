var atlmonJSServices = angular.module('atlmonJSServices', [ 'ngResource' ]);

atlmonJSServices.constant('baseurl', {
  'url' : 'url/to/api'       // For the testbed
  // 'url' : 'https://oraweb.cern.ch/ords/offdb/dbmon_schema/'         // For production 

}).constant('userurl', {
  'user' : 'databases/'
})

.factory(
    'BasicInfoGet', 
    [
        '$resource', 
        'baseurl', 
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'basic_info/:db/5';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
       return res;
        } ]);


atlmonJSServices.factory(
    'DbUpInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'db/state/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices.factory(
    'StreamsInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'streams_info/:db/:node/:metric/:from/:to';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


// Service to get an Array of all DB-names        
atlmonJSServices
.factory(
    'DbNamesGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'all_databases/';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.factory(
    'DbDetailsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'all_databases/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.factory(
    'Top10SessionsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'top10_sessions/:db/:from/:to';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
          return res;
        } ]);


atlmonJSServices
.factory(
    'SessionDistrGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'db/session_distribution/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
          return res;
        } ]);


atlmonJSServices
.factory(
    'SessionsChartGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'schema/num_sessions_chart/:db/:schema/:from/:to/:node';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
          return res;
        } ]);


atlmonJSServices
.factory(
    'ExpPlanGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'db/exp_plan/:db/:sqlId';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


atlmonJSServices
.factory(
    'AWRInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'awr_info/:db/:sqlId';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


 // Used from DB-Page with Wildcard and from Application with specific schema
atlmonJSServices
.factory(
    'JobsBasicInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'jobs_info/stats/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


// Used from DB-Page with Wildcard and from Application with specific schema
atlmonJSServices
.factory(
    'JobsInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'jobs_info/details/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.factory(
    'StorageInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'storage_info/:db/:schema/:year';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.factory(
    'AllSchemasGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'all_schemas/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


atlmonJSServices
.factory(
    'AllSchemasGetNoAll',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'all_schemas/no_all/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


atlmonJSServices
.factory(
    'SchemasDetailsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'schema/account_info/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


atlmonJSServices
.factory(
    'SchemaSessionsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
        var url = baseurl.url + 'schema/session_distribution/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;  
        } ]);


atlmonJSServices
.factory(
    'SchemaSessionsDetailsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'schema/sessions/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


atlmonJSServices
.factory(
    'Top10SessionsPerSchemaGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'schema/top10_sessions/:db/:node/:schema/:from/:to';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);

atlmonJSServices
.factory(
    'SchemaNodesGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {

          var url = baseurl.url + 'schema/nodes/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


atlmonJSServices
.factory(
    'BlockingSessGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'select_blocking_sessions/:db/:from/:to'; 
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);

//Necessary to get the data without the data-variables (NULL for to and from)
atlmonJSServices
.factory(
    'BlockingSessGetDefault',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'select_blocking_sessions/:db'; 
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.factory(
    'ApplyLagGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'apply_lag/:db'; 
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.factory(
    'AppMessageGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'app_message'; 
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.factory(
    'Top10TablesGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + 'schema/top10_tables/:db/:schema/:year';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


atlmonJSServices
.service(
    'RegisterChange',
    ['$location',
     'DateTimeService',
      function($location, DateTimeService) {
        return {
          getNode: function() {
            if(typeof node !== "undefined") {
              return node;
            } else if ($location.search().node) {
              return $location.search().node;
            } else return null;
          },
          setNode: function(id) {
            node = id;
          },
          getDate: function () {
            if(typeof dates[0] !== "undefined" && typeof dates[1] !== "undefined") {
              return dates;
            } else if ($location.search().from && $location.search().to) {
              return [$location.search().from, $location.search().to];
            } else
                return [DateTimeService.format(DateTimeService.initialTime()[0]),
                        DateTimeService.format(DateTimeService.initialTime()[1])];
          },
          setDate: function(period) {
            dates = period;
          },
          getSchema: function () {
            if(typeof schema !== "undefined") {
              return schema;
            } else if ($location.search().schema) {
              return $location.search().schema;
            } else return "all";
          },
          setSchema: function(name) {
            schema = name;
          },
          getDb: function () {
            if(typeof db !== "undefined") {
              return db;
            } else if ($location.search().db) {
              return $location.search().db;
            } else return null;
          },
          setDb: function(name) {
            db = name;
          }
        };
      }]);


atlmonJSServices
.service(
    'RegisterSearchAppChage',
    [
      function() {
        return {
          getDb: function () {
            if(typeof db !== "undefined") {
              return db;
            } else return null;
          },
          setDb: function(item) {
            db = item;
          },
          getSchema: function () {
            if(typeof schema !== "undefined") {
              return schema;
            } else return null;
          },
          setSchema: function(name) {
            schema = name;
          },
          getLastSchema: function () {
            if(typeof lastSchema !== "undefined") {
              return lastSchema;
            } else return null;
          },
          setLastSchema: function(name) {
            lastSchema = name;
          },
          resetInput: function() {
            delete schema;
            delete db;
          }
        };
      }]);


atlmonJSServices
.service(
    'RegisterSchemas',
    [
      function() {
        return {
          getSchemas: function () {
            if(typeof schemas !== "undefined") {
              return schemas;
            } else return null;
          },
          setSchemas: function(items) {
            temp = []
            for (var i = items.length - 1; i >= 0; i--) {
              if (!items[i].endsWith("_R") && !items[i].endsWith("_W") 
                && !items[i].endsWith("_READER") && !items[i].endsWith("_WRITER")) {
                temp.push(items[i]);
              }
            };
            
            schemas = temp;
          }
        };
      }]);


atlmonJSServices
.service(
    'BlockingTree',
    [
      function() {
        return {
          buildTree: function(data) {
            var children, e, id, o, pid, temp, _i, _len, _ref;
            id = data.waiting_sess_id || "waiting_sess_id";            
            pid = data.blocking_sess_id || "blocking_sess_id";
            children = data.children || "children";
            temp = {};
            o = [];
            _ref = data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              e = _ref[_i];
              e[children] = []; 
              temp[e[id]] = e;
              if (temp[e[pid]] != null) {
                temp[e[pid]][children].push(e);
              } else {
                o.push(e);
              }
            }
            return o;
          }
        };
      }]);


atlmonJSServices
.service(
    'ResizeSessContainer',
    [
      function () {
        return {
          setSize: function(noSessions, container, nrOfSessions) {
            if (noSessions) {
              height = '100%';
            } else if (nrOfSessions < 10) {
              height = (nrOfSessions * 35 + 120).toString();
              height = height + 'px';
            } else if (nrOfSessions >= 10) {
              height = '400px';
            }
            angular.element(container).css('height', height);
          }
        }
      }
      ]);



atlmonJSServices
.factory(
    'DateTimeService',
    [
      function () {
        return {
          initialTime: function() {
            var now = new Date();
            // starting point is 20min ago
            var start = new Date(now);
            start.setMinutes(now.getMinutes() - 20);
            var end = now;

            return [start, end];
          },
          initialTimeBlockingTree: function() {
            var now = new Date();
            // starting point is 3h ago
            var start = new Date(now);
            start.setMinutes(now.getMinutes() - 180);
            var end = now;

            return [start, end];
          },
          streamsPlotInitTime: function() {
            var now = new Date();
            // starting point is 12h ago
            var start = new Date(now);
            start.setMinutes(now.getHours() - 12*60);
            var end = now;

            return [start, end];
          },
          lastTwoYears: function() {
            y = (new Date()).getFullYear();

            return ['ALL', y - 2, y - 1, y];
          },
          format: function(date) {
            ten = function(i) {
              return (i < 10 ? '0' : '') + i;
            };
            var year = date.getFullYear();
            var month = ten(date.getMonth()+1);
            var day = ten(date.getDate());
            var hours = ten(date.getHours());
            var minutes = ten(date.getMinutes());
            var seconds = ten(date.getSeconds());

            return year + "-" + month + "-" + day + "T" + hours + ':' + minutes;
          },
          formatDisplay: function(date) {
            return date.replace("T", " ");
          },
          formatQuery: function(date) {
            return date.replace(" ", "T");
          },
        }
      }
    ]);

// Service to get the next Pages of a Query-result with >500 entries 
atlmonJSServices
.factory('ContinueQuery', function($resource) {
  return {
    query: function(url){
      return $resource(url, {
        'query': {
          method: 'GET',
          isArray:false
        },
        'get': {
          method: 'GET',
          isArray:false,
        }
      }).get();
    }
  }
});
