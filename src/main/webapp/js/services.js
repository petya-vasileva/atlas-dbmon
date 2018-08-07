var atlmonJSServices = angular.module('atlmonJSServices', [ 'ngResource' ]);

atlmonJSServices.constant('baseurl', {
  //'url' : 'https://atlas-dbamon.web.cern.ch/dbmonapi/'            // When in production with JDBC
  // 'url' : 'https://test-dbmon.web.cern.ch/test-dbmon/dbmon/'
  'url' : 'http://localhost:8080/dbmonapi/'                         //When running locally with JDBC
//  'url' : 'https://oraweb.cern.ch/ords/test1/DBMON_SCHEMA_R/metadata-catalog/'
//  'url' : 'url/to/api'       // When using Oracle REST API

}).constant('userurl', {
  'user' : 'databases/'
})
//BSCHEER DONE
.factory(
    'BasicInfoGet', ['$resource', 'baseurl', 'userurl',
        function($resource, baseurl, userurl) {
          // URL for the REST API
          //  var url = baseurl.url + 'BasicInfo/' + ':db/' + '5/';
          var url= 'url/to/apiBasicInfo/:db/5';
          //  window.alert(url);  // Test URL-construction
          
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
       return res;
        } ]);


// BSCHEER DONE
atlmonJSServices.factory(
    'StreamsInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url= 'url/to/apiStreamsInfo/:db/:node/:metric/:from/:to';
          //  window.alert(url);  // Test URL-construction
          
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;

          // var url = baseurl.url + userurl.user
          //     + ':db/streaminfo?node=:node&metric=:metric&from=:from&to=:to';
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);


// BSCHEER DONE
// Service to get an Array of all DB-names        
atlmonJSServices
.factory(
    'DbNamesGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + userurl.user;
          var url = 'url/to/apiall_databases/';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);

//BSCHEER DONE
atlmonJSServices
.factory(
    'SingleDbInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + userurl.user;
          var url = 'url/to/apiall_databases/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);



// atlmonJSServices
// .factory(
//     'SessionsTotalInfo',
//     [
//         '$resource',
//         'baseurl',
//         'userurl',
//         function($resource, baseurl, userurl) {
//           var url = baseurl.url + 'BasicInfo/' + ':db/' + '5/';
//           var url= 'url/to/apiSessionInfo/total/:db';
//           var res = $resource(url, {}, {
//             query: {
//               method: 'GET',
//               isArray: false
//             }});
    
//           return res;
//         } ]);







        // BSCHEER WIP
        // Not in Use?
        // jetzt wird plötzlich die URL aufgerufen...also doch o_O
atlmonJSServices
.factory(
    'DbDetailsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url= 'url/to/apiall_databases/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
          return res;
          // var url = baseurl.url + userurl.user
          //     + ':db';
          // // window.alert(url);
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : false
          //   }
          // });

          // return res;
        } ]);


// NOT IN USE
atlmonJSServices
.factory(
    'MetricHistDataGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + userurl.user
              + 'basic/db/:db/:metricId';
          var res = $resource(url, {}, 
          {
            query : {
              method : 'GET',
              isArray : true
            }
          });
          
          return res;
        } ]);

// BSCHEER DONE
atlmonJSServices
.factory(
    'Top10SessionsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + userurl.user
          //     + 'charts/:db/period?from=:from&to=:to';

          // var url = baseurl.url + 'Top10Sessions/' + ':db/' + ':from/' + ':to/';
          var url= 'url/to/apiTop10Sessions/:db/:from/:to';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
          return res;

          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);

/** BSCHEER - WIP
 * Service or the Controller of the Session_distr. table in the left half of the application
 */
atlmonJSServices
.factory(
    'SessionDistrGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + 'BasicInfo/' + ':db/' + '5/';
          var url= 'url/to/apiSessionInfo/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
          return res;
        } ]);

//BSCHEER DONE 
atlmonJSServices
.factory(
    'SessionsChartGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
                    // var url = baseurl.url + 'SessionChartInfo/:db/:schema/:from/:to/:node';
          var url= 'url/to/apiSessionChartInfo/:db/:schema/:from/:to/:node';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
    
          return res;
          // var url = baseurl.url + userurl.user
          //     + 'sessionschart?db=:db&schema=:schema&fromDate=:from&toDate=:to&node=:node';
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);

// BSCHEER DONE
atlmonJSServices
.factory(
    'ExpPlanGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url= 'url/to/apiExpPlan/:db/:sqlId';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
          // var url = baseurl.url + userurl.user
          //     + ':db/explan?sqlId=:sqlId';
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);

// BSCHEER DONE
atlmonJSServices
.factory(
    'AWRInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url= 'url/to/apiAWRInfo/:db/:sqlId';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
          // var url = baseurl.url + userurl.user
          //     + ':db/awrinfo?sqlId=:sqlId';
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);

/**BSCHEER DONE
 * Used from DB-Page with Wildcard and from Application with specific schema
 */
atlmonJSServices
.factory(
    'JobsInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + 'JobsInfo/:db/:schema'
          var url= 'url/to/apiJobsInfo/:db/:schema';
          // window.alert(url);
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);

/**BSCHEER - DONE
 * 
 */
atlmonJSServices
.factory(
    'StorageInfoGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + userurl.user
          //     + ':db/storage?schema=:schema&year=:year';
          // var url = baseurl.url + 'StorageInfo/:db/:schema/:year'
          var url= 'url/to/apiStorageInfo/:db/:schema/:year';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
          return res;
        } ]);


/**BSCHEER DONE
 *  
 */        
atlmonJSServices
.factory(
    'AllSchemasGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + 'AllSchemas/:db'
          var url= 'url/to/apiAllSchemas/:db';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);


/**BSCHEER DONE
*
*/
atlmonJSServices
.factory(
    'SchemasDetailsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + userurl.user
          //     + 'schemaDetails?schema=:schema&db=:db';
          var url= 'url/to/apiSchemaDetails/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);

/**BSCHEER
 * 
 */
atlmonJSServices
.factory(
    'SchemaSessionsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
        // var url = baseurl.url + 'SchemaSessions/:db/:schema'
        var url= 'url/to/apiSchemaSessions/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;  
          // var url = baseurl.url + userurl.user
          //     + 'sesssions?db=:db&schema=:schema';          
          //     var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);

//BSCHEER DONE
atlmonJSServices
.factory(
    'SchemaSessionsDetailsGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + userurl.user
          //     + 'sesssionDetails?db=:db&schema=:schema';
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
          var url= 'url/to/apiSchemaSessionDetails/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);

// BSCHEER DONE
atlmonJSServices
.factory(
    'Top10SessionsPerSchemaGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          // var url = baseurl.url + userurl.user
          //     + 'schemaCharts?db=:db&node=:node&schema=:schema&from=:from&to=:to';
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
          var url= 'url/to/apiTop10SessPerSchema/:db/:node/:schema/:from/:to';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;
        } ]);

//BSCHEER DONE
atlmonJSServices
.factory(
    'SchemaNodesGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {

          var url= 'url/to/apiSchemaSessNodes/:db/:schema';
          var res = $resource(url, {}, {
            query: {
              method: 'GET',
              isArray: false
            }});
         return res;

          // var url = baseurl.url + userurl.user
          //     + 'schemaNodes?db=:db&schema=:schema';
          // var res = $resource(url, {},
          // {
          //   query : {
          //     method : 'GET',
          //     isArray : true
          //   }
          // });
          // return res;
        } ]);

//BSCHEER 02/02/2018
atlmonJSServices
.factory(
    'BlockingSessGet',
    [
        '$resource',
        'baseurl',
        'userurl',
        function($resource, baseurl, userurl) {
          var url = baseurl.url + userurl.user
              + 'blocking_sessions?db=:db&from=:from&to=:to';
          //var url = 'url/to/apiselectBlockingSessions/select/ONDB/30-06-2018/02-07-2018';
          //var url = baseurl.url + 'selectBlockingSessions/select/' + ':db/:from/:to' 

          var res = $resource(url, {},
          {
            query : {
              method : 'GET',
              isArray : true
            }
          });
          return res;
        } ]);


atlmonJSServices
.service(
    'RegisterTop10Queries',
    [
    ]);

/**
 * BSCHEER: Changed from wildcard % to "all" and added switch on this word in the ORDS
 */
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
            console.log(name);
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

//RETURNS undefined - why?

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
            id = data.child_sess_id || "child_sess_id";
            pid = data.parent_sess_id || "parent_sess_id";
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
            // console.log(noSessions, container, nrOfSessions);
            if (noSessions) {
              height = '100%';
            } else if (nrOfSessions < 10) {
              height = (nrOfSessions * 50).toString();
              height = height + 'px';
            } else if (nrOfSessions > 10) {
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
          streamsPlotInitTime: function() {
            var now = new Date();
            // starting point is 10min ago
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
})
