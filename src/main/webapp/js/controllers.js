var atlmonJSControllers = angular.module('atlmonJSControllers', ['ngMaterial', 'ngMaterialDatePicker']);

atlmonJSControllers.run(function($rootScope, $location, DateTimeService, RegisterChange) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) {

      if ($location.path().startsWith('/db/') && !$location.path().includes('sql_id=')) {

        RegisterChange.setDb($location.path().substr($location.path().lastIndexOf("/")+1));
        if (angular.isUndefined($location.search().from) ||
            angular.isUndefined($location.search().to) ||
            angular.isUndefined($location.search().node)) {
          from = DateTimeService.format(DateTimeService.initialTime()[0]);
          to = DateTimeService.format(DateTimeService.initialTime()[1]);
          node = 1;
          $location.search({'node': 1,
                            'from': from,
                              'to': to});
          RegisterChange.setDate([from, to]);
          RegisterChange.setNode(node);
        } else if (angular.isDefined($location.search().from) &&
                  angular.isDefined($location.search().to) &&
                  angular.isDefined($location.search().node)) {
          RegisterChange.setDate([$location.search().from, $location.search().to]);
          RegisterChange.setNode($location.search().node);
        }
      } else if ($location.path().startsWith('/sessions') &&
                RegisterChange.getSchema() == null && angular.isDefined($location.search().schema) &&
                RegisterChange.getDb() == null && angular.isDefined($location.search().db) &&
                RegisterChange.getDate() == null &&
                angular.isDefined($location.search().from) && angular.isDefined($location.search().to)) {
        RegisterChange.setSchema($location.search().schema);
        RegisterChange.setDb($location.search().db);
        RegisterChange.setDate([$location.search().from, $location.search().to]);
      } else if ($location.path().startsWith('/hist-blocking-tree') &&
          angular.isDefined($location.search().from) ||
          angular.isDefined($location.search().to) ||
          angular.isDefined($location.search().db)) {
          RegisterChange.setDate([$location.search().from, $location.search().to]);
          RegisterChange.setDb($location.search().db);
      } else if ($location.path().startsWith('/hist-blocking-tree') &&
          angular.isUndefined($location.search().from) ||
          angular.isUndefined($location.search().to) ||
          angular.isUndefined($location.search().db)) {
          RegisterChange.setDate([DateTimeService.format(DateTimeService.initialTime()[0]),
                              DateTimeService.format(DateTimeService.initialTime()[1])]);
      }
    });
});

/** NOTHING TO DO HERE
 * The controller that refreshes the page every 5 min
 */
atlmonJSControllers.controller(
  'GlobalCtrl',
  [
    '$interval',
    '$route',
    '$location',
    'RegisterChange',
    'DateTimeService',
  function($interval, $route, $location, RegisterChange, DateTimeService) {
    // there is no point to auto refresh the historical page on the blovking sessions
    if (!$location.path().startsWith('/hist-blocking-tree')) {
      $interval(function(){
        console.log('reload');
        location.reload();
      }.bind(this), 300000);
    }
}]);


/** NOTHING TO DO HERE
 * The controller for selecting an item from the menu
 */
atlmonJSControllers.controller('MenuCtrl',
  function($scope, $location, $interval, $route, RegisterChange, DateTimeService) {

    $scope.menuClass = function(page) {
      // we need to take always the first 2 attributes form the URL. Ex.:"db/adcdb"
      var attr = $location.path().split("/");
      var loc = "";

      if (attr.length>3) {
        loc = attr[1] + "/" + attr[2];
      }
      else
        // in case it's "/home"
        loc = $location.path().substr(1);

      if ($location.search().db)
        loc = 'db/' + $location.search().db;

      // keep the "APPLICATION" tab active even when we change the URL
      if (loc == 'app')
        loc = 'app/search';

      return page === loc ? "active" : "";
    };
});


/** BSCHEER - DONE
 * The Controller for the Box around the Charts.
 * 
 */
atlmonJSControllers.controller(
    'DbDetailsCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      '$window',
      'DbDetailsGet',
      'DateTimeService',
      function($routeParams, $scope, $location, $window, DbDetailsGet, DateTimeService) {
        $scope.currentDB = $routeParams.currentDB;

        var nodesRes = DbDetailsGet.query({db: $routeParams.currentDB.toUpperCase()});
        // console.log(nodesRes);
        $scope.nodes = nodesRes.$promise.then(function(result){ return result.items[0];});
        // console.log('scope nodes:', $scope.nodes);


        // console.log( DbDetailsGet.query({db: $routeParams.currentDB.toUpperCase()}));
        var from, to;
        from = DateTimeService.format(DateTimeService.streamsPlotInitTime()[0]);
        to = DateTimeService.format(DateTimeService.streamsPlotInitTime()[1]);

        $scope.nodeNumber = 2;

        $scope.showHistory = function (db) {
          var path = '/history';
          $location.url(path).search({'db': db, 'node': node, 'from': from, 'to': to});
        }

        $scope.goTo = function (target) {
          switch (target) {
            case 'kill':
              path = 'http://cern.ch/session-manager';
              break;
            case 'ddl':
              path = 'https://atlas-chaman.web.cern.ch/atlas-chaman/';
              break;
            case 'list':
              path = 'queries';
              break;
            case 'streams':
              path = 'https://strmmon.web.cern.ch/strmmon/web/streams/dbs.php';
              break;
            }

            $window.open(path, '_blank');
          };

        nodesRes.$promise.then(function (result) {
          var nodeNums =  result.items[0].dbnodes;
          $scope.nodeNum = Array.apply(null, Array(nodeNums)).map(function (x, i) { return i; })
          // new Array(parseInt(nodeNums));
          // console.log($scope.nodeNum);
        });
      }
    ]);


/** BSCHEER DONE
 * The controller for getting all database names.
 */
atlmonJSControllers.controller(
    'DbListCtrl',
    [
      '$routeParams',
      '$scope',
      'DbNamesGet',
      function($routeParams, $scope, DbNamesGet) {
        $scope.databases = DbNamesGet.query();
        // console.log( DbNamesGet.query());
        $scope.databases.$promise.then(function (result) {
          // TODO: replace that with Angular material
          // Add group id to the databse scope so the db tables can be grouped in diferent <div>-s
        angular.forEach($scope.databases, function(obj){
          switch (obj.position){
            case 1:
            case 2:
            case 3:
              obj.group = 1;
              break;
            case 4:
            case 5:
              obj.group = 2;
              break;
            default:
              obj.group = 3;
            }
          });
        }); 
      }
    ]);


/** BSCHEER DONE
 * The controller for retrieving basic metrics for each of the databases.
 */
atlmonJSControllers.controller(
    'BasicInfoCtrl',
    [
      '$scope',
      'BasicInfoGet',
      function( $scope, BasicInfoGet) {
        // This [next 10 lines or so...] can be done better, but for now it's clearer this way:
        dbMericsData = BasicInfoGet.query({db: $scope.dbName});
        // console.log(dbMericsData);
        res = dbMericsData.$promise.then(function(result) {
        $scope.dbMerics = result.items; 
        });
        $scope.dbMerics = res;

        dbMericsData.$promise.then(function (result) { 
              // $scope.nodeNum = result.items[0].instid; // Not sure, if still used by some Elements. Can be deleted in the End of the Project.
              // $scope.nodeNum = new Array(parseInt(result.items[0].nrofnodes));
              $scope.NrOfNodes = result.items[0].nrofnodes; // used for dynamic nr of columns in the basicInfo and DB metrics overview
              
              $scope.alert = function (value, row) {
                if (value > row.threshold ) {
                  return { background: "#981A37", color: "#fff" }}

                else {
                  return { background: "#229369", color: "#fff" }}
            };
           });
      }
    ]);


/** BSCHEER - DONE
 * The controller for retrieving performance history for the database
 */
atlmonJSControllers.controller(
    'StreamsInfoCtrl',
    [
      '$scope',
      '$location',
      'StreamsInfoGet',
      'DbDetailsGet',
      'DateTimeService',
      function( $scope, $location, StreamsInfoGet, DbDetailsGet, DateTimeService) {
        var db, node, from, to;
        db = $location.search().db;
        node = $location.search().node;
        to = $location.search().to;
        from = $location.search().from;

        // ??????? o_O   O_o   O_O   x_x
        $scope.nodeNumber = 1;

        var nodesRes = DbDetailsGet.query({db: db.toUpperCase()});
        $scope.nodeNum = nodesRes.$promise.then(function(result){ return result.items[0].dbnodes;});

        cpuPlot = StreamsInfoGet.query({db: db, node: node, metric: 2057, from: from, to: to});
        cpuPlot.$promise.then(function (result) {
          // console.log('cpuPlot: ',result.items);
          $scope.cpuData = result.items;
        });

        usertransPlot = StreamsInfoGet.query({db: db, node: node, metric: 2003, from: from, to: to});
        usertransPlot.$promise.then(function (result) {
          $scope.usertransData = result.items;
        });

        physreadsPlot = StreamsInfoGet.query({db: db, node: node, metric: 2004, from: from, to: to});
        physreadsPlot.$promise.then(function (result) {
          $scope.physreadsData = result.items;
        });

        logonsPlot = StreamsInfoGet.query({db: db, node: node, metric: 2018, from: from, to: to});
        logonsPlot.$promise.then(function (result) {
          $scope.logonsData = result.items;
        });

        logreadsPlot = StreamsInfoGet.query({db: db, node: node, metric: 2030, from: from, to: to});
        logreadsPlot.$promise.then(function (result) {
          $scope.logreadsData = result.items;
        });

        resptimePlot = StreamsInfoGet.query({db: db, node: node, metric: 2106, from: from, to: to});
        resptimePlot.$promise.then(function (result) {
          $scope.resptimeData = result.items;
        });

        osloadPlot = StreamsInfoGet.query({db: db, node: node, metric: 2135, from: from, to: to});
        osloadPlot.$promise.then(function (result) {
          $scope.osloadData = result.items;
        });

        sessionsPlot = StreamsInfoGet.query({db: db, node: node, metric: 2143, from: from, to: to});
        sessionsPlot.$promise.then(function (result) {
          $scope.sessionsData = result.items;
        });

        actsessPlot = StreamsInfoGet.query({db: db, node: node, metric: 2147, from: from, to: to});
        actsessPlot.$promise.then(function (result) {
          $scope.actsessData = result.items;
        });

        physreadbytesPlot = StreamsInfoGet.query({db: db, node: node, metric: 2126, from: from, to: to});
        physreadbytesPlot.$promise.then(function (result) {
          $scope.physreadbytesData = result.items;
        });
      }
    ]);



/** BSCHEER DONE
 * The controller for getting the top SQLs
 */
atlmonJSControllers.controller(
    'Top10SessChartCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      '$timeout',
      '$q',
      'Top10SessionsGet',
      'RegisterChange',
      'DateTimeService',
      function($routeParams, $scope, $location, $timeout, $q, Top10SessionsGet, RegisterChange, DateTimeService) {
        var node = RegisterChange.getNode();
        var from = RegisterChange.getDate()[0];
        var to = RegisterChange.getDate()[1];

        // we need to substract 1 because in the view the $index starts from 0,
        // so the value is always increased by 1
        $scope.selectedIndex = node - 1;
        queryTop10(from, to);

        //default tab is 1
        $scope.OnSelectedTab = function(tabId) {
          $scope.tab = tabId;
          RegisterChange.setNode(tabId);
          $scope.isDataLoaded = false;
          $location.search({'node': tabId,
                            'from': RegisterChange.getDate()[0],
                              'to': RegisterChange.getDate()[1]});
        
         if         (tabId == 1 ) {
            $scope.chValues = $scope.chartValues.node1;
          } else if (tabId == 2) {
            $scope.chValues = $scope.chartValues.node2;
          } else if (tabId == 3 ) {
            $scope.chValues = $scope.chartValues.node3;
          } else if (tabId == 4 ) {
            $scope.chValues = $scope.chartValues.node4;
          }

          $scope.isDataLoaded = true;
        }
          
            
        function queryTop10(from, to) {
          var top10sess = Top10SessionsGet.query({db: $routeParams.currentDB, from: from, to: to});


          $scope.isDataLoaded = false;
          top10sess.$promise.then(function(result) {

            $scope.chartValues = {};
            $scope.loadedNode = 0;

          // Here: Shape data for further processing in the chValues
          // result of query is one big List, here seperated to Arrays, containing just the data for the charts.
                // Declare Objects for the Data of each node
            var node1 = {activity: activity = [], cpu: cpu = [], rows_processed: rows_processed = [],  
                        elapsed_time: elapsed_time = [], executions: executions = [], disk_reads: disk_reads = [] };
            var node2 = {activity: activity = [], cpu: cpu = [], rows_processed: rows_processed = [],  
                        elapsed_time: elapsed_time = [], executions: executions = [], disk_reads: disk_reads = [] };
            var node3 = {activity: activity = [], cpu: cpu = [], rows_processed: rows_processed = [],  
                        elapsed_time: elapsed_time = [], executions: executions = [], disk_reads: disk_reads = [] };
            var node4 = {activity: activity = [], cpu: cpu = [], rows_processed: rows_processed = [],  
                        elapsed_time: elapsed_time = [], executions: executions = [], disk_reads: disk_reads = [] };

            result.items.forEach(function(item){
            // Every item gets pushed to the object/array according to its own values inst_id (node) and chart_type
              eval("node" + item.inst_id + "."+item.chart_type).push(item);
            });
              
            var stage1 = {node1:node1, node2:node2, node3:node3, node4:node4}
            // Assigning a default-value and updating check-variables 
            $scope.chValues = stage1[0];
            $scope.isDataLoaded = true;
            $scope.loadedNode = 1;

            // Passing the results of the query to the scope variable we will be working with.
            $scope.chartValues =  stage1;
          });
        }

        $scope.updateDateTime = function() {
          // get the new dates from the service DateTimeRegisterChange
          from = RegisterChange.getDate()[0];
          to = RegisterChange.getDate()[1];
        };
      }
    ]);


/**
 * The controller for setting up datetime picker
 */
atlmonJSControllers.controller(
    'DateTimePickerCtrl',
    [
      '$scope',
      '$route',
      '$location',
      'RegisterChange',
      'DateTimeService',
      function($scope, $route, $location, RegisterChange, DateTimeService) {
        // On Refresh button click get the last 10 minutes
        $scope.reset = function() {
          if(angular.isDefined($location.search().from) && angular.isDefined($location.search().to) &&
                                angular.isDefined($location.search().node)) {
            $location.search({'node': RegisterChange.getNode(),
                              'from': DateTimeService.format(DateTimeService.initialTime()[0]),
                                'to': DateTimeService.format(DateTimeService.initialTime()[1])});
          } else if(angular.isDefined($location.search().from) && angular.isDefined($location.search().to) &&
                                angular.isDefined($location.search().schema) && angular.isDefined($location.search().db)) {
            $location.search({'schema': RegisterChange.getSchema(),
                                  'db': RegisterChange.getDb(),
                                'from': DateTimeService.format(DateTimeService.initialTime()[0]),
                                  'to': DateTimeService.format(DateTimeService.initialTime()[1])});
          }
          RegisterChange.setDate([DateTimeService.format(DateTimeService.initialTime()[0]),
                                  DateTimeService.format(DateTimeService.initialTime()[1])]);
          $route.reload();
        }

        $scope.dateTimeStart = DateTimeService.formatDisplay(RegisterChange.getDate()[0]);
        $scope.dateTimeEnd = DateTimeService.formatDisplay(RegisterChange.getDate()[1]);

        // observe the date fields for change and set the service if any
        $scope.$watchCollection("[dateTimeStart, dateTimeEnd]", function(date) {
          var start = date[0];
          var end = date[1];
          RegisterChange.setDate([DateTimeService.formatQuery(start), DateTimeService.formatQuery(end)]);
        }, true);
      }
    ]);


/** BSCHEER - DONE
 * The controller for getting the session distribution information
 */
atlmonJSControllers.controller(
    'SessDistrCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      '$window',
      'SessionDistrGet',
      'SingleDbInfoGet',
      'ResizeSessContainer',
      'RegisterChange',
      function($routeParams, $scope, $location, $window, SessionDistrGet, SingleDbInfoGet, ResizeSessContainer, RegisterChange) {
        $scope.username = '%';

        $scope.show = function(row) {
          $scope.username = row.username;
          RegisterChange.setSchema(row.username);
          path = '/#/sessions?schema=' + row.username + '&db=' + RegisterChange.getDb() +
                 '&from=' + RegisterChange.getDate()[0] + '&to=' + RegisterChange.getDate()[1];
          $window.open(path, '_blank');
        };

        // Change css style on hover in the session table
        $scope.rowselected = function(row) {
          $scope.rowNumber = row;
        }

        // Main Query for the Session-Info-table. Can not cover Total & NrOfNodes.
        ThisSessInfo = SessionDistrGet.query({db: $routeParams.currentDB});
         ThisSessInfo.$promise.then(function (result) {
               $scope.sessInfo = result.items;
            });

        //added 2nd Query for Information about the NrOfNodes in theDatabase.
        ThisDbInfo = SingleDbInfoGet.query({db: $routeParams.currentDB});
        ThisDbInfo.$promise.then(function (result) { 
              $scope.NrOfNodes = result.items[0].dbnodes; // used for dynamic nr of columns in the basicInfo and DB metrics overview
        });


          // ThisSessInfo.$promise.then(function (result) {
          // // $scope.nodeNum = angular.fromJson($scope.sessInfo[0].nodeMap);
          // var noSessions = result.items.length == 0; //working
          // ResizeSessContainer.setSize(noSessions, '.session-list', result);
          // });


          ThisSessInfo.$promise.then(function (result) { 
              var noSessions = result.items.length == 0; //working
              var nrOfSessions = result.items.length;
              ResizeSessContainer.setSize(noSessions, '.session-list', nrOfSessions);

              $scope.alert = function (value, row) {
                if (row.workload >= 0.95 ) {
                  return { background: "#981A37"}}

                else if (row.workload >= 0.85 && row.workload < 0.95){
                  return { background: "#cb6828"}}

                else{
                  return { background: "#229369"}}
            };
           });
      }
    ]);



/** BSCHEER - WIP: Is the timeout really necessary???
 * The controller for getting the session distribution information
 */
atlmonJSControllers.controller(
    'SessChartCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      'SessionsChartGet',
      'RegisterChange',
      'SchemaNodesGet',
      '$timeout',
      function($routeParams, $scope, $location, SessionsChartGet, RegisterChange, SchemaNodesGet, $timeout) {

        var db = RegisterChange.getDb();
        var schema = RegisterChange.getSchema();

        // $scope.nodes = SchemaNodesGet.query({db: db, schema: schema});
        var nodesLoc = SchemaNodesGet.query({db: db, schema: schema});
        $scope.nodes = nodesLoc;
      $timeout(function(){
        nodesLoc.$promise.then(function (result) {
          RegisterChange.setNode(result.items[0].inst_id);
          $scope.selectedIndex = result.items[0].inst_id;
          getData();
        });        
      },500)

        $scope.OnSelectedTab = function(tabId) {
          RegisterChange.setNode(tabId);
          getData();
        }

        function getData() {
          var isDataLoaded = false;
          var sessData = SessionsChartGet.query({db: db,
                                             schema: schema,
                                               from: RegisterChange.getDate()[0],
                                                 to: RegisterChange.getDate()[1],
                                               node: RegisterChange.getNode()});

          $scope.isDataLoaded = false;
          sessData.$promise.then(function (result) {
            $scope.sessChartData = {};
            $scope.sessChartData = result.items;
            $scope.isDataLoaded = true;
          });
        }

        $scope.updateDateTime = function() {
          // get the new dates from the service DateTimeRegisterChange
          from = RegisterChange.getDate()[0];
          to = RegisterChange.getDate()[1];
          $location.search('from', from);
          $location.search('to', to);

          getData();
        };
      }
    ]);


/** BSCHEER DONE
 * Shouldnt it be index -1 nstead of +1?
 * The controller for getting the execution plan and the AWR statistics for a single sql_id
 */
atlmonJSControllers.controller(
    'SqlDetailsrCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      '$window',
      '$timeout',
      'ExpPlanGet',
      'AWRInfoGet',
      'ContinueQuery',
      function($routeParams, $scope, $location, $window, $timeout, ExpPlanGet, AWRInfoGet, ContinueQuery) {
        var path = $location.path();
        var sid = path.substr(path.indexOf("sql_id")+7);

        $scope.numLimit = 30;
        $scope.toggleText = 'more';
        var toggleHide = true;
        $scope.isExpanded = function() {
          if (toggleHide) {
            $scope.numLimit = 10000;
            $scope.toggleText = 'less';
          } else {
            $window.scrollTo(0, 0);
            $scope.numLimit = 30;
            $scope.toggleText = 'more'
          }
          toggleHide = !toggleHide;
        }

        $scope.expPlan = ExpPlanGet.query({db: $routeParams.currentDB, sqlId: sid});
        $scope.expPlan.$promise.then(function (result) {
          $scope.planRes = result.items;
        });

        awr = awrfull();
        
          $scope.awrInfo = awr;
          result = awr;
          $scope.alert = function (idx, row, type) {
              var previous;
              if (idx <= result.length-2) {
                if (type == 'buffer_gets') {
                  return setStyle(row.buffer_gets, result[idx+1].buffer_gets);
                } else if (type == 'disk_reads') {
                  return setStyle(row.disk_reads, result[idx+1].disk_reads);
                } else if (type == 'fetches') {
                  return setStyle(row.fetches, result[idx+1].fetches);
                } else if (type == 'execs') {
                  return setStyle(row.execs, result[idx+1].execs);
                } else if (type == 'parse_calls') {
                  return setStyle(row.parse_calls, result[idx+1].parse_calls);
                } else if (type == 'direct_writes') {
                  return setStyle(row.direct_writes, result[idx+1].direct_writes);
                } else if (type == 'rows_proc') {
                  return setStyle(row.rows_proc, result[idx+1].rows_proc);
                } else if (type == 'cpu_time') {
                  return setStyle(row.cpu_time, result[idx+1].cpu_time);
                } else if (type == 'elapsed_time') {
                  return setStyle(row.elapsed_time, result[idx+1].elapsed_time);
                } else if (type == 'etime_per_exec') {
                  return setStyle(row.etime_per_exec, result[idx+1].etime_per_exec);
                } else if (type == 'iowait') {
                  return setStyle(row.iowait, result[idx+1].iowait);
                } else if (type == 'cluster_wait') {
                  return setStyle(row.cluster_wait, result[idx+1].cluster_wait);
                } else if (type == 'app_wait') {
                  return setStyle(row.app_wait, result[idx+1].app_wait);
                } else if (type == 'concurrency') {
                  return setStyle(row.concurrency, result[idx+1].concurrency);
                } else if (type == 'plsql_time') {
                  return setStyle(row.plsql_time, result[idx+1].plsql_time);
                }
              }
            };

            function setStyle(curr, prev) {
              if (curr > prev + prev*0.2 && curr < prev + prev*0.4) {
                return { background: "#96b2d4" }
              } else if (curr > prev + prev*0.4 && curr < prev + prev*0.8) {
                return { background: "#5a93c7" }
              } else if (curr > prev + prev*0.8 && curr < prev + prev) {
                return { background: "#236494" }
              } else if (curr > prev*2 && curr < prev*3) {
                return { background: "#11487a" }
              } else if (curr > prev*3) {
              return { background: "#003453" }
              }

            }

        
        // Queries the ContinueQuery Service which can be used for any URL
        function getMore(queryresult) {
            var continuation =  queryresult.$promise.then(function (result) {
            if (result.links[3].rel == "next") {
              nextURL = result.links[3].href;
              newResult = ContinueQuery.query(nextURL);
              // newResult.$promise.then(function(newresult){console.log('Result from next URL',newresult);});
              return newResult;
            }
            else {
              var nomore = "nomore";
              return nomore;
            }
          });
            return continuation;
        }


        //Function to get the data and decide how many runs are needed.
        function awrfull(){
          var AWRStack = [];
          var hasMore = false;
          awr = AWRInfoGet.query({db: $routeParams.currentDB, sqlId: sid});
          
          awr.$promise.then(function (result) {
            for (i in result.items) {
                AWRStack.push(result.items[i]);
            };
            // console.log('awrstack vom ersten Run: ', AWRStack);
            // console.log('result hasMore',result.hasMore);
            if (result.hasMore == true) {hasMore = true;}
            // console.log('variable hasmore after setting to result state', hasMore);

            if (hasMore == true) {
              // console.log('Aufruf whileMore durch if hasMore == true');
              whileMore(result);
            }});  

            function whileMore(prevResult){
              // console.log('Aufruf der whileMore Funktion');
              awrContinue = getMore(prevResult);
                if (awrContinue != "nomore"){
                awrContinue.then(function (subresult) {
                  // console.log('Checkout subresult', subresult);
                  $timeout(function(){
                  for (var i = 0;  i < subresult.items.length ; i++) {
                    AWRStack.push(subresult.items[i]);
                  }
                  if (subresult.hasMore == true) {hasMore = true;}
                  else {hasMore = false}
                  },1700);

                  // console.log('AWRStack nach  for-Schleife',AWRStack);
                  if (hasMore == true) {
                    // console.log('Aufruf der Funktion durch sich selbst');
                    whileMore(subresult);
                  }
                  else {
                    console.log('All data successfully loaded');
                  }
                });  
              }
            }
          return AWRStack;

        }

    }
    ]);

/** BSCHEER DONE
 * The controller for getting the list of scheduler jobs for each database.
 */
atlmonJSControllers.controller(
      'JobsInfoCtrl',
      [
        '$rootScope',
        '$routeParams',
        '$location',
        '$scope',
        'JobsInfoGet',
        'RegisterChange',
        function($rootScope, $routeParams, $location, $scope, JobsInfoGet, RegisterChange) {
          var db = RegisterChange.getDb();
          var schema = RegisterChange.getSchema();
          getData(schema);

          function getData(schema) {
            var data = JobsInfoGet.query({db: db, schema: schema});
              data.$promise.then(function (result) {
              $scope.data = result.items;
            });
          }

          // ADGs don't have jobs
          if (db == 'adcdb_adg' || db == 'ondb_adg')
            angular.element('.jobs-table').css('display', 'none');

          $scope.idSelectedRow = null;
          $scope.setSelected = function(idSelectedRow) {
            $scope.idSelectedRow = idSelectedRow;
          }

          $scope.highlight = function (row) {
            if (row.current_state == 'RUNNING' ) {
              return { background: "#AA8C30" }
            }
            else if (row.current_state == 'DISABLED' ) {
              return { background: "#8e8e8e" }
            }
            else if (row.last_status === 'FAILED' ) {
              return { background: "#981A37" }
            }
            else if (row.last_status === 'SUCCEEDED' ) {
              return { background: "#585858" }
            } 
            else {
              return { background: '#8e8e8e'}
            }
          };
        }
      ]);

/**BSCHEER - DONE
 * The controller for getting the storage volume
 */
atlmonJSControllers.controller(
    'StorageInfoCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      'StorageInfoGet',
      'AllSchemasGet',
      'DateTimeService',
      'RegisterChange',
      function($routeParams, $scope, $location, StorageInfoGet, AllSchemasGet,
        DateTimeService, RegisterChange) {

        var db = RegisterChange.getDb();
        if (db == 'adcdb_adg' || db == 'ondb_adg')
          angular.element('.storage-container').css('display', 'none');

        // Get all unique schema names for a specific database
        var allSchemas = AllSchemasGet.query({db: db});

        allSchemas.$promise.then(function (result) {
            $scope.allSchemas = result.items;
            //Search all Schemas for the schema in the URL and select as default in dropdown-list
            var searchSchema = result.items.filter(obj => {
              return obj.schema_name == RegisterChange.getSchema().toUpperCase();   })
            var schemaPosition = result.items.indexOf(searchSchema[0]);
            // set default value in the dropdown
            // $scope.item = $scope.allSchemas[0];
            $scope.item = $scope.allSchemas[schemaPosition];
        });

        // var selectedSchema = 'ALL'
        var selectedSchema = RegisterChange.getSchema().toUpperCase();
        // On dropdown item change
        $scope.update = function() {
          selectedSchema = $scope.item.schema_name;
          queryStorageData($scope.selected_year, selectedSchema);
        }

        years = DateTimeService.lastTwoYears();
        $scope.years_back = years;
        $scope.selected_year = years[years.length - 1];

        $scope.$watch("selected_year", function(newValue, oldValue) {
          queryStorageData(newValue, selectedSchema);
        }, true);

        function queryStorageData(year, schema) {
          // Oracle expects a number
          if (year == 'ALL')
            year = 0;

            var storageInfo = StorageInfoGet.query({db: db,
                                              schema: schema,
                                                year: year});
          $scope.isDataLoaded = false;
          return storageInfo.$promise.then(function(result) {
            $scope.storageData = result.items;
            $scope.isDataLoaded = true;
          });
        }
      }
    ]);

// BSCHEER WIP
atlmonJSControllers.controller(
    'AllSchemasCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      'AllSchemasGet',
      'RegisterSearchAppChage',
      'DbNamesGet',
      'RegisterChange',
      function($routeParams, $scope, $location, AllSchemasGet,
        RegisterSearchAppChage, DbNamesGet, RegisterChange, $timeout, $q, $log) {
        var self = this;
        self.schemas = loadAll();
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange  = searchTextChange;

        var db = $location.search().db;
        if (db !== undefined)
          $scope.dbModel = db;

        function querySearch (query) {
          var sch = self.schemas.$$state.value;

          var results = query ? sch.filter( createFilterFor(query) ) : self.schemas,
              deferred;
          if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
              deferred.resolve( results );
            }, 500, false);
            return deferred.promise;
          } else {
            return results;
          }
        }

        function searchTextChange(text) {
        }

        function selectedItemChange(item) {
          if (item !== "undefined" && item != null) {
            RegisterSearchAppChage.setSchema(item);
            RegisterSearchAppChage.setLastSchema(item);
            // RegisterSearchAppChage.setSchema(item.display);
            // RegisterSearchAppChage.setLastSchema(item.display);

          }
        }

        // pre-fill the last selected schema name
        var lastSelected = RegisterSearchAppChage.getLastSchema();
        if (lastSelected != null) {
          self.selectedItem = lastSelected;
          RegisterSearchAppChage.setSchema(lastSelected);
        }

        function loadAll() {
          var allSchemas = AllSchemasGet.query({db: 'all'});
          return allSchemas.$promise.then(function (result) {
            var list = [];
            for(var i=0;i<result.items.length;i++){
              name = result.items[i].schema_name;
              list.push({ value: name.toLowerCase(), display: allSchemas[i]});
            }
            return list;
          });
        }

        //Create filter function for a query string
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(schema) {
            if (schema.value.includes(lowercaseQuery))
              return true;
            return false;
          };
        }

        //BSCHEER changed to ORDS
        DbNamesGet.query().$promise.then(function(result) {
        $scope.databases = result.items; 
        });
        // On dropdown item change
        $scope.update = function(item) {
          RegisterChange.setDb(item);
          RegisterSearchAppChage.setDb(item)
        }

        $scope.generateReport = function() {
          var schema = RegisterSearchAppChage.getSchema();
          var db = RegisterSearchAppChage.getDb();
          console.log('schema für Report:', schema);
          if (schema != null && db != null) {
            $location.path('/app').search({'schema': schema, 'db': db});
            RegisterSearchAppChage.resetInput();
          }
          else {
            $scope.incomplInput = true;
          }
        }

      }
    ]);

/** BSCHEER DONE
 * Controller for the Dropdown.List in "Application"
 * 
 */
atlmonJSControllers.controller(
    'SchemaDropDownCtrl',
    [
      '$scope',
      '$location',
      'DbNamesGet',
      'RegisterChange',
      function($scope, $location, DbNamesGet, RegisterChange) {
        var db = $location.search().db;
        if (db !== undefined)
          $scope.dbModel = db.toUpperCase();

        // $scope.databases = DbNamesGet.query();
        // On dropdown item change
        $scope.update = function(item) {
          RegisterChange.setDb(item.toLowerCase());
        }

      }
    ]);

/**BSCHEER
* WIP
*/
atlmonJSControllers.controller(
    'SchemaDetailsrCtrl',
    [
      '$scope',
      '$location',
      '$timeout',
      'SchemasDetailsGet',
      'SchemaSessionsGet',
      'SchemaSessionsDetailsGet',
      'RegisterSchemas',
      'ResizeSessContainer',
      'RegisterChange',
      function($scope, $location, $timeout, SchemasDetailsGet, SchemaSessionsGet,
        SchemaSessionsDetailsGet, RegisterSchemas, ResizeSessContainer, RegisterChange) {
        var dbName = RegisterChange.getDb();
        $scope.currSchema = RegisterChange.getSchema();
        $scope.db = dbName;

        var toggleHide = true;
        $scope.text = 'See';
        $scope.changeText = function () {
          if (toggleHide) {
            $scope.text = 'Hide';
          } else {
            $scope.text = 'See'
          }
          toggleHide = !toggleHide;
        }

        getDeteails();
        // $scope.details = getDeteails();
        $scope.accounts = [];
        // function getDeteails() {
        //    $scope.details = SchemasDetailsGet.query({'schema': $scope.currSchema,
        //                                                 'db': $scope.db});

        //   return $scope.details.$promise.then(function (result) {
        //     $scope.noSessions = result.items.length == 0;
        //     console.log('SchemaDetailsGet', result);
        //     for (var i=0;i<result.items.length;i++){
        //       // $scope.accounts.push(result.items[i].userName);
        //       $scope.accounts.push(result.items[i].username);
        //     }
        //     RegisterSchemas.setSchemas($scope.accounts);
        //     // set default schema
        //     $scope.sitem = $scope.details[0];
        //   })
        // }

       function getDeteails() {
        // console.log($scope.currSchema, $scope.db);
           detailsQry = SchemasDetailsGet.query({'schema': $scope.currSchema,
                                                        'db': $scope.db});
          // console.log(detailsQry);
          locdetails = detailsQry.$promise.then(function (result) {
            $scope.noSessions = result.items.length == 0;
            // console.log('SchemaDetailsGet', result);
            for (var i=0;i<result.items.length;i++){
              // $scope.accounts.push(result.items[i].userName);
              $scope.accounts.push(result.items[i].username);
            }
            RegisterSchemas.setSchemas($scope.accounts);
            // set default schema
            // $scope.sitem = $scope.details[0];
            $scope.sitem = result.items[0];

            //test
            $scope.details = result.items;
            // console.log($scope.details);

            // return result.items;
          })
          // console.log(locdetails);
          // return locdetails;
        }

        $scope.selectedSchema = RegisterSchemas.getSchemas();
        
        $scope.update = function(account) {
          // console.log('call from update');
          sessOverview(dbName, account.username);
          sessDetails(dbName, "0".concat(account.username));
        }

        // console.log('call from currSchema mit', $scope.currSchema);
        sessOverview(dbName, $scope.currSchema);
        
        function sessOverview(db, schema) {
          sessInfoRes = SchemaSessionsGet.query({db: db, schema: schema});
          // console.log('SchemaSessionsGet NEU:',sessInfoRes);
          // $scope.sessInfo = sessInfoRes;

          $scope.sessInfo = sessInfoRes.$promise.then(function (result) {
            $scope.noSessions = result.items.length == 0;
            // console.log($scope.noSessions);
            // console.log('SchemaSessionsGet', result.items);
            ResizeSessContainer.setSize($scope.noSessions, '.app-sess-table1', result.items.length);

            return result.items;
            //result durch result.items.length ersetzt
          });
          // console.log($scope.sessInfo);
        }


        // append 0 to the schema name in order to execute slightly different query 
        // in the function GET_SCHEMA_SESS_DETAILS
        // Searches with 0 are treated als "schemaName like "mySchema%" " and without 0 as "schemaName = "mySchema""
        // sessDetails(dbName, "0".concat(RegisterChange.getSchema()));
        // function sessDetails(db, schema) {
        //   $scope.sessDetails = SchemaSessionsDetailsGet.query({db: db, schema: schema});
        //   $scope.sessDetails.$promise.then(function (result) {
        //     $scope.noSessions = result.length == 0;
        //     console.log('SchemaSessionsDetailsGet', result);
        //     ResizeSessContainer.setSize($scope.noSessions, '.app-sess-table2', result);
        //   });
        // }

        SelSchema = RegisterChange.getSchema();
        // $timeout(function(){console.log(SelSchema);}, 1000); 
        // sessDetails(dbName, SelSchema);
        sessDetails(dbName, "0".concat(SelSchema));
        function sessDetails(db, schema) {
          sessDetailsRes = SchemaSessionsDetailsGet.query({db: db, schema: schema});
          sessDetailsRes.$promise.then(function(result){
            // console.log('SessionDetails',result.items);
            $scope.sessDetails = result.items;            
          })

          sessDetailsRes.$promise.then(function (result) {
          $scope.noSessions = result.items.length == 0;
          ResizeSessContainer.setSize($scope.noSessions, '.app-sess-table2', result.items.length);
          });
        }

        $scope.show =function(sql_id) {
          if (sql_id !== null) {
            var path = '/db/' + $scope.db.toLowerCase() + '/sql_id=' + sql_id;
            $location.search({});
            $location.path(path);
          }
        }
      }
    ]);

/**
 * The controller for getting the charts data for a schema name
 */
atlmonJSControllers.controller(
        'SchemaTop10Ctrl',
        [
          '$scope',
          '$location',
          'DateTimeService',
          'Top10SessionsPerSchemaGet',
          'SchemaNodesGet',
          'RegisterChange',
          function($scope, $location, DateTimeService,
            Top10SessionsPerSchemaGet, SchemaNodesGet, RegisterChange) {
            var schema = RegisterChange.getSchema();
            var db = RegisterChange.getDb();

            var from = RegisterChange.getDate()[0];
            var to = RegisterChange.getDate()[1];
            // from.setMinutes(to.getMinutes() - 20);
            // from = DateTimeService.format(moment(from).toDate());
            // to = DateTimeService.format(moment(to).toDate())

            // append 0 to the schema name in order to execute slightly different query 
            // in the function GET_SCHEMA_SESS_DETAILS
            // $scope.nodes = SchemaNodesGet.query({db: db, schema: "0".concat(schema)});
            // $scope.nodes.$promise.then(function (result) {
            //   getData(result[0]);
            //   $scope.selectedIndex = 0;
            // });

            //BSCHEER NEW
            //returns only nodes 
            nodesResult = SchemaNodesGet.query({db: db, schema: "0".concat(schema)});
            // Where does the node info come from? Is it needed, if data for all nodes is fetched anyway?

            $scope.nodes = nodesResult.$promise.then(function (result) {
              getData(result.items[0].inst_id); //tab_id / node as input for function
              $scope.selectedIndex = 0;
              console.log(result);
              return result.items;
            });


            $scope.OnSelectedTab = function(tabId) {
              $scope.tab = tabId;
              getData(tabId);
            }

            function getData(tabId) {
              $scope.top10 = Top10SessionsPerSchemaGet.query({db: db, 
                                    node: tabId, 
                                    schema: schema,
                                    from: from, 
                                    to: to });
              $scope.top10.$promise.then(function (result) {
                console.log('result from schematop10:',result);
                if (tabId == 1) {
                  $scope.chValues = result[0].nodeMap.node1;
                } else if (tabId == 2) {
                  $scope.chValues = result[0].nodeMap.node2;
                } else if (tabId == 3) {
                  $scope.chValues = result[0].nodeMap.node3;
                } else
                  $scope.chValues = result[0].nodeMap.node4;
              });
            }
          }
        ]);


/**
 * The controller for getting the charts data for a schema name
 */
atlmonJSControllers.controller(
        'BlockSessCtrl',
        [
          '$scope',
          '$location',
          '$routeParams',
          '$window',
          '$interval',
          'BlockingSessGet',
          'BlockingTree',
          function($scope, $location, $routeParams, $window, $interval, BlockingSessGet, BlockingTree) {
            // var schema = $location.search().selected;
            var db = $routeParams.currentDB;
            GetLocks();

            function GetLocks() {
              var data = BlockingSessGet.query({db: db});
              
              // TOFIX: This is not the correct way to wait for the data to load.
              data.$promise.then(function (result) {
                var get_tree = BlockingTree.buildTree(result);
                if (get_tree.length == 0)
                  angular.element('.block-tree').html('<p>There are no blocking sessions in the last minutes.</p>');
                $scope.treedata= get_tree;
              });
            }

            $scope.goToURL = function() {
              $location.search({}); // clean up all query parameters
              var path = '/#/hist-blocking-tree';
              $window.open(path, '_blank');
            }

            $scope.myTreeControl = {};
            $scope.type = 0;
            $scope.setPath = function(sql_id) {
              // TOFIX: Fix the links. Remove /db/adcdb/... replace with
              // query params then one of the check will be unneccessary
              $location.search({}); // clean up all query parameters
              var path = $location.url() + '/sql_id=' + sql_id;
              path = $location.absUrl().substr(0, $location.absUrl().indexOf("#")+1) + path;

              $window.open(path, '_blank');
            }

            $scope.expandingProperty = {
              field: "child_sess_id",
              displayName: "Session ID"
            };

            $scope.colDefs = [
            {
              field: "child_sess_id",
              displayName: "Session ID"
            },
            {
              field: "logon_time",
              displayName: "Logon Time"
            },
            {
              field: "user_name",
              displayName: "User Name"
            },
            {
              field: "os_user",
              displayName: "OS User"
            },
            {
              field: "program",
              displayName: "Program"
            },
            {
              field: "machine",
              displayName: "Machine"
            },
            {
              field: "blocking_sess_wait_class",
              displayName: "Wait Class"
            },
            {
              field: "sql_id",
              displayName: "SQL ID",
              cellTemplate: '<a ng-click="cellTemplateScope.click(row.branch.sql_id)">{{row.branch.sql_id}}</a>',
              cellTemplateScope: {
                  click: function(data) {
                      $scope.setPath(data);
                  }
              }
            },
            {
              field: "time_wait",
              displayName: "Time Wait"
            },
            {
              field: "blocking_on_table_owner",
              displayName: "Lock Owner"
            },
            {
              field: "blocking_on_table_name",
              displayName: "Lock Table"
            },
            {
              field: "blocking_on_row_address",
              displayName: "Row Address"
            }];

          }
        ]);

/**
 * The controller that deals with the blocking sessions from past periods
 */
atlmonJSControllers.controller(
        'HistBlockTreeCtrl',
        [
          '$scope',
          '$location',
          '$window',
          'BlockingSessGet',
          'BlockingTree',
          'RegisterChange',
          function($scope, $location, $window, BlockingSessGet, BlockingTree, RegisterChange) {

            $scope.noSessions, $scope.missingDb;

            var db = RegisterChange.getDb();
            var from = RegisterChange.getDate()[0];
            var to = RegisterChange.getDate()[1];
            if (db != null && from != null && to != null)
              GetLocks(db, from, to);

            function GetLocks(specDb, specFrom, specTo) {
              var data = BlockingSessGet.query({db: specDb, from: specFrom, to: specTo});
              $scope.isDataLoaded = false;
              $scope.treedata = [];

              // TOFIX: This is not the correct way to wait for the data to load.
              data.$promise.then(function (result) {
                if (result.length == 0) {
                  $scope.noSessions = true;
                }
                else {
                  $scope.noSessions = false;
                  $scope.treedata = BlockingTree.buildTree(result);
                }
                $scope.isDataLoaded = true;
              });
            }

            $scope.updateDateTime = function() {
              if (RegisterChange.getDb() == null)
                $scope.missingDb = true;
              else {
                var db = RegisterChange.getDb();
                var from = RegisterChange.getDate()[0];
                var to = RegisterChange.getDate()[1];

                GetLocks(db, from, to);
                $location.search({'db': db,
                                'from': from,
                                  'to': to});
              }
            };

            $scope.myTreeControl = {};
            $scope.type = 0;
            $scope.setPath = function(sql_id) {
              $location.search({}); // clean up all query parameters
              var path = '#/db/' + RegisterChange.getDb() + '/sql_id=' + sql_id;
              $window.open(path, '_blank');
            }

            $scope.expandingProperty = "child_sess_id";

            $scope.colDefs = [
            {
              field: "child_sess_id",
              displayName: "Session ID"
            },
            {
              field: "logon_time",
              displayName: "Logon Time"
            },
            {
              field: "user_name",
              displayName: "User Name"
            },
            {
              field: "os_user",
              displayName: "OS User"
            },
            {
              field: "program",
              displayName: "Program"
            },
            {
              field: "machine",
              displayName: "Machine"
            },
            {
              field: "blocking_sess_wait_class",
              displayName: "Wait Class"
            },
            {
              field: "sql_id",
              displayName: "SQL ID",
              cellTemplate: '<a ng-click="cellTemplateScope.click(row.branch.sql_id)">{{row.branch.sql_id}}</a>',
              cellTemplateScope: {
                  click: function(data) {
                      $scope.setPath(data);
                  }
              }
            },
            {
              field: "time_wait",
              displayName: "Time Wait"
            },
            {
              field: "blocking_on_table_owner",
              displayName: "Lock Owner"
            },
            {
              field: "blocking_on_table_name",
              displayName: "Lock Table"
            },
            {
              field: "blocking_on_row_address",
              displayName: "Row Address"
            }
            ];

          }
        ]);

// BSCHEER: Normal Storage Controller used now. 
// TOFIX: Make StorageInfoCtrl generic. Don't use the following controller. 
// The code is almost the same!
atlmonJSControllers.controller(
    'SchemaStorageInfoCtrl',
    [
      '$scope',
      '$location',
      'StorageInfoGet',
      'AllSchemasGet',
      'RegisterSchemas',
      'RegisterChange',
      function($scope, $location, StorageInfoGet, AllSchemasGet, RegisterSchemas, RegisterChange) {
          db = $location.search().db;

        // TOFIX: data is available later than requested
        var schemas = RegisterSchemas.getSchemas();

        var selectedSchema = 'ALL'
        // var selectedSchema = RegisterChange.getSchema();
        // $scope.item = RegisterChange.getSchema();

        // On dropdown item change
        $scope.update = function() {
          selectedSchema = $scope.item;
          queryStorageData();
        }

        // radio buttons
        $scope.radioModel = '2016';
        $scope.$watch("radioModel", function(newValue, oldValue) {
          queryStorageData();
        }, true);


        function queryStorageData() {
          var storageInfo = StorageInfoGet.query({db: $routeParams.currentDB,
                                              schema: selectedSchema,
                                                year: $scope.radioModel});
          $scope.isDataLoaded = false;
          return storageInfo.$promise.then(function(result) {
            $scope.storageData = angular.fromJson(result);
            $scope.isDataLoaded = true;
          });
        }
      }
    ]);

