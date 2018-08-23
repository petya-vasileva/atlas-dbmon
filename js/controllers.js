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
        $scope.nodes = nodesRes.$promise.then(function(result){ return result.items[0];});
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
      'JobsBasicInfoGet',
      'ApplyLagGet',
      'DbUpInfoGet',
      '$mdDialog',
      function( $scope, BasicInfoGet, JobsBasicInfoGet, ApplyLagGet, DbUpInfoGet, $mdDialog) {
        //Get infos about the metrics and nodes of the database
        BasicInfoGet.query({db: $scope.dbName}).$promise.then(function(result) {
          $scope.dbMerics = result.items;
          $scope.NrOfNodes = result.items[0].nrofnodes; 
        });

        //Get Infos about JOBS running on the database
        var data = JobsBasicInfoGet.query({db: $scope.dbName, schema: 'all'});
        data.$promise.then(function (result) {
          $scope.dbJobs = result.items;
          if (result.items[0].total_jobs == 0){
            $scope.hasJobs =  false;
          } else {$scope.hasJobs =  true;}
        });


        //Get Infos about the APPLY-LAG only for the ADGs and OFFDB
        // console.time("ApplyLagTimer" + $scope.dbName);
        if($scope.dbName.toUpperCase() == "OFFDB" || $scope.dbName.toUpperCase() == "ONDB_ADG" 
            || $scope.dbName.toUpperCase() == "ADCDB_ADG" ){
          var lag = ApplyLagGet.query({db: $scope.dbName});
          lag.$promise.then(function (result) {
            $scope.applyLag = result.items;
            $scope.isOFFDB = false;
            if (result.items.length >0) {
              if (result.items[0].dbname.toUpperCase() == 'OFFDB') {$scope.isOFFDB = true}
            } 
          // console.timeEnd("ApplyLagTimer" + $scope.dbName);
          });
        }


        // Get infos about DB UP / DOWN
        // console.time("DBUP_Timer" + $scope.dbName);
        var dbup = DbUpInfoGet.query({db: $scope.dbName});
        dbup.$promise.then(function (result) {
          if (result.items[0].status == 1){
            $scope.dbisup = {state: true, message: "UP"};
          } else {
            $scope.dbisup = {state: false, message: "DOWN"};          
        }        
        // console.timeEnd("DBUP_Timer"+ $scope.dbName);
});

        $scope.alert = function (value, row) {
            if (value > row.threshold ) { return { background: "#981A37", color: "#fff" }}
            else                        { return { background: "#229369", color: "#fff" }}
        };

        $scope.lagAlert = function (lag) {
          if (lag > 600 )      { return { background: "#981A37", color: "#fff" }}
          else if ( lag > 300) { return { background: "#DAA520", color: "#fff" }}
            // return { background: "#AA8C30", color: "#fff" }} //color used in jobs
          else                 { return { background: "#229369", color: "#fff" }}
        };

        $scope.statusAlert = function (status) {
          if (status == "ENABLED"){ return { background: "#229369", color: "#fff" }
          } else                  { return { background: "#DAA520", color: "#fff" }
        }};

        $scope.jobAlert = function (job) {
          if (job.failed_jobs > 0 ) { return { background: "#981A37", color: "#fff" }}
          else                      { return { background: "#229369", color: "#fff" }}
        };

        $scope.downAlert = function (dbup) {
          if (dbup == false) {
            return { background: "#981A37", color: "#fff", margin: "1px 8px", 
                     lineHeight: "25px", minHeight: "25px", minWidth: "70px" };
          } else {
            return { background: "#229369", color: "#fff", margin: "1px 8px", 
                     lineHeight: "25px", minHeight: "25px", minWidth: "70px" }};
        };

        $scope.noBottomMargin = function() {
          if ($scope.isOFFDB == true) {return {marginBottom: "0px"};}
        };

        $scope.showError = function(ev) {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title("Error-details:")
            .textContent("Database is currently not available. Please contact the administrator for more details")
            .ariaLabel('Alert Dialog Demo')
            .ok('close')
            .targetEvent(ev)
        );};

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

        $scope.nodeNumber = 1;

        var nodesRes = DbDetailsGet.query({db: db.toUpperCase()});
        $scope.nodeNum = nodesRes.$promise.then(function(result){ return result.items[0].dbnodes;});
        cpuPlot = StreamsInfoGet.query({db: db, node: node, metric: 2057, from: from, to: to});
        cpuPlot.$promise.then(function (result) {
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

          // Shape data for further processing in the chValues
          // Result of query is one big List, here seperated to Arrays, containing just the data for the charts.
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
          queryTop10(from, to);

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
          var RegexpDate = new RegExp(/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s([01][0-9]|2[0-3]):[0-5][0-9]$/);
          normalStyle = {"background-color" : "white"}
          dateErrorStyle = {"background-color" : "LightPink"}

          // Checking the input-Format and setting Style for Input-Box
          if (RegexpDate.test(date[0]) ) {
            $scope.dpstyleFrom = normalStyle; 
          } else {$scope.dpstyleFrom = dateErrorStyle;}       

          if (RegexpDate.test(date[1]) ) {
            $scope.dpstyleTo = normalStyle; 
          } else {$scope.dpstyleTo = dateErrorStyle;} 

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
      'DbDetailsGet',
      'ResizeSessContainer',
      'RegisterChange',
      function($routeParams, $scope, $location, $window, SessionDistrGet, DbDetailsGet, ResizeSessContainer, RegisterChange) {
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
        ThisDbInfo = DbDetailsGet.query({db: $routeParams.currentDB});
        ThisDbInfo.$promise.then(function (result) { 
              $scope.NrOfNodes = result.items[0].dbnodes; // used for dynamic nr of columns in the basicInfo and DB metrics overview
        });

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

        var nodesLoc = SchemaNodesGet.query({db: db, schema: schema});
        $scope.nodes = nodesLoc;
      $timeout(function(){
        nodesLoc.$promise.then(function (result) {
          RegisterChange.setNode(result.items[0].inst_id);
          $scope.selectedIndex = result.items[0].inst_id;
          getData();
        });        
      },200)

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
          // switch for the sometimes strange 1-string resultsets.
          if (result.items[1].plan_table_output.length > 140 &&result.items.length == 2) {
            var chunks = result.items[1].plan_table_output.split(/(.{100}\S*)\s/).filter(function(e){return e;});
            var resultset = result.items;
            resultset.splice(1,1);
              for (var i = 0;  i < chunks.length ; i++) {
                resultset.push({plan_table_output: chunks[i]});
              }
            $scope.planRes = resultset;

          } else {
            $scope.planRes = result.items;
          }
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
        // Not needed anymore
        function getMore(queryresult) {
            var continuation =  queryresult.$promise.then(function (result) {
            if (result.links[3].rel == "next") {
              nextURL = result.links[3].href;
              newResult = ContinueQuery.query(nextURL);
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

            if (result.hasMore == true) {hasMore = true;}
            if (hasMore == true) {
              whileMore(result);
            }

          });  

            function whileMore(prevResult){
              awrContinue = getMore(prevResult);
                if (awrContinue != "nomore"){
                awrContinue.then(function (subresult) {
                  $timeout(function(){
                  for (var i = 0;  i < subresult.items.length ; i++) {
                    AWRStack.push(subresult.items[i]);
                  }
                  if (subresult.hasMore == true) {hasMore = true;}
                  else {hasMore = false}
                  },1700);

                  if (hasMore == true) {
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

// BSCHEER DONE
//Controller of the any-App
atlmonJSControllers.controller(
    'AllSchemasCtrl',
    [
      '$routeParams',
      '$scope',
      '$location',
      'AllSchemasGet',
      'AllSchemasGetNoAll',
      'RegisterSearchAppChage',
      'DbNamesGet',
      'RegisterChange',
      'DateTimeService',
      function($routeParams, $scope, $location, AllSchemasGet, AllSchemasGetNoAll,
        RegisterSearchAppChage, DbNamesGet, RegisterChange, DateTimeService, $timeout, $q, $log) {
        var self = this;
        self.schemas = loadAll();
        loadedSchemas = loadAll();
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange  = searchTextChange;
        $scope.InputErrorStyle = {"position": "absolute", "bottom": "0"};

        var db = $location.search().db;
        if (db !== undefined)
          $scope.dbModel = db;


        //Create a watcher on the database
        //Execute query on schemas get with db
        //change scope.schemas to the new list of schemas
        $scope.$watch("dbModel", function(newValue, oldValue) {
          // console.log(newValue);
          if (newValue !== undefined && newValue !== oldValue){
            self.schemas = loadSchemasDb(newValue);
            loadedSchemas = loadSchemasDb(newValue);
          } else if (newValue == undefined) {self.schemas = loadAll(); loadedSchemas = loadAll();}
          // console.log(self.schemas);
          // console.log(loadedSchemas);
        }, true);




        function querySearch (query) {
          var sch = loadedSchemas.$$state.value; //self.schemas.$$state.value;
          // console.log(sch);
          // console.log('this is the query passed to the fn:', query);
          var results = query ? sch.filter( createFilterFor(query) ) : loadedSchemas,  //self.schemas,
              deferred;
              // console.log(results);
          if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
              deferred.resolve( results );
            // }, 500, false);
            }, 250, false);
            return deferred.promise;
          } else {
            return results;
          }
        }


        function searchTextChange(text) {
          // console.log('searchTextChange', text);
          // console.log(text);
          $scope.queryItems = querySearch(text);
        }

        function selectedItemChange(item) {
          if (item !== "undefined" && item != null) {
            RegisterSearchAppChage.setSchema(item);
            RegisterSearchAppChage.setLastSchema(item);
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

        //BSCHEER NEW
        function loadSchemasDb(selectedDb) {
          // console.log('loading schemas for ', selectedDb);
          var allSchemas = AllSchemasGetNoAll.query({db: selectedDb});
          return allSchemas.$promise.then(function (result) {
            var list = [];
            for(var i=0;i<result.items.length;i++){
              name = result.items[i].schema_name;
              list.push({ value: name.toLowerCase(), display: allSchemas[i]});
            }
            // console.log('loading:', list);
            return list;
          });
        }

        //Create filter function for a query string
        function createFilterFor(query) {
          var lowercaseQuery = angular.$$lowercase(query);

          return function filterFn(schema) {
            if (schema.value.includes(lowercaseQuery))
              return true;
            return false;
          };
        }

        DbNamesGet.query().$promise.then(function(result) {
        $scope.databases = result.items; 
        });
        // On dropdown item change
        $scope.update = function(item) {
          RegisterChange.setDb(item);
          RegisterSearchAppChage.setDb(item);
          // console.log('uebergebenes item:', item);
          $scope.dbModel = item;
          searchTextChange('');
          querySearch('');
        }

        $scope.generateReport = function() {
          var schema = RegisterSearchAppChage.getSchema();
          var db = RegisterSearchAppChage.getDb();
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
 * Controller for the Dropdown.List in "Application" and HistTree
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

        dbs = DbNamesGet.query();
        dbs.$promise.then(function(result){
          // console.log(result.items);
          $scope.all_databases = result.items;
        });
        // On dropdown item change
        $scope.update = function(item) {
          RegisterChange.setDb(item.toLowerCase());
        }

      }
    ]);

/**BSCHEER
* DONE
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
        $scope.accounts = [];

       function getDeteails() {
           detailsQry = SchemasDetailsGet.query({'schema': $scope.currSchema,
                                                        'db': $scope.db});
          locdetails = detailsQry.$promise.then(function (result) {
            $scope.noSessions = result.items.length == 0;
            for (var i=0;i<result.items.length;i++){
              $scope.accounts.push(result.items[i].username);
            }
            RegisterSchemas.setSchemas($scope.accounts);

            // set default schema
            $scope.sitem = result.items[0];
            $scope.details = result.items;
          })
        }

        $scope.selectedSchema = RegisterSchemas.getSchemas();
        
        $scope.update = function() {
          selectedSchema = $scope.sitem.username;
          sessOverview(dbName, selectedSchema);
          sessDetails(dbName, "0".concat(selectedSchema));
        }

        sessOverview(dbName, $scope.currSchema);
        
        function sessOverview(db, schema) {
          sessInfoRes = SchemaSessionsGet.query({db: db, schema: schema});

          $scope.sessInfo = sessInfoRes.$promise.then(function (result) {
            $scope.noSessions = result.items.length == 0;
            ResizeSessContainer.setSize($scope.noSessions, '.app-sess-table1', result.items.length);
            return result.items;
          });
        }


        SelSchema = RegisterChange.getSchema();
        sessDetails(dbName, "0".concat(SelSchema));
        function sessDetails(db, schema) {
          sessDetailsRes = SchemaSessionsDetailsGet.query({db: db, schema: schema});
          sessDetailsRes.$promise.then(function(result){

            $timeout(function(){
              $scope.$apply(function() {
                $scope.sessDetails = result.items;
              });
            })
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

/** This is not perfect but could be adapted quickly to use the new Top10 per schema data
 * The controller for getting the charts data for a schema name
 */
atlmonJSControllers.controller(
        'SchemaTop10Ctrl',
        [
          '$routeParams',
          '$scope',
          '$location',
          'DateTimeService',
          'Top10SessionsPerSchemaGet',
          'SchemaNodesGet',
          'RegisterChange',
          'DateTimeService',
          function($routeParams, $scope, $location, DateTimeService,
            Top10SessionsPerSchemaGet, SchemaNodesGet, RegisterChange, DateTimeService) {
            var schema = RegisterChange.getSchema();
            var db = RegisterChange.getDb();
            var node = RegisterChange.getNode(); 
            var from = DateTimeService.format(DateTimeService.streamsPlotInitTime()[0]);
            var to = DateTimeService.format(DateTimeService.streamsPlotInitTime()[1]);

            $scope.selectedIndex = node - 1;
            querySessTop10(from, to);

            //returns only nodes 
            nodesResult = SchemaNodesGet.query({db: db, schema: "0".concat(schema)});
            nodesResult.$promise.then(function (result) {
              $scope.selectedIndex = 0;
              $scope.nodes = result.items;
            });


        $scope.OnSelectedTab = function(tabId) {
          $scope.tab = tabId;
          RegisterChange.setNode(tabId);
          $scope.isDataLoaded = false;
          // $location.search({'node': tabId,
          //                   'from': RegisterChange.getDate()[0],
          //                     'to': RegisterChange.getDate()[1]});
        
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


        function querySessTop10(from, to) {
          var top10sess = Top10SessionsPerSchemaGet.query({db: db, schema: schema, from: from, to: to });

          $scope.isDataLoaded = false;
          top10sess.$promise.then(function(result) {
            console.log(result.items);

            $scope.chartValues = {};
            $scope.loadedNode = 0;

          // Shape data for further processing in the chValues
          // Result of query is one big List, here seperated to Arrays, containing just the data for the charts.
                // Declare Objects for the Data of each node
            var node1 = {buffer_gets: buffer_gets = [], cpu: cpu = [], rows_processed: rows_processed = [],  
                        elapsed_time: elapsed_time = [], executions: executions = [], disk_reads: disk_reads = [] };
            var node2 = {buffer_gets: buffer_gets = [], cpu: cpu = [], rows_processed: rows_processed = [],  
                        elapsed_time: elapsed_time = [], executions: executions = [], disk_reads: disk_reads = [] };
            var node3 = {buffer_gets: buffer_gets = [], cpu: cpu = [], rows_processed: rows_processed = [],  
                        elapsed_time: elapsed_time = [], executions: executions = [], disk_reads: disk_reads = [] };
            var node4 = {buffer_gets: buffer_gets = [], cpu: cpu = [], rows_processed: rows_processed = [],  
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
          'BlockingSessGetDefault',
          function($scope, $location, $routeParams, $window, $interval, BlockingSessGet, BlockingTree, BlockingSessGetDefault) {
            // var schema = $location.search().selected;
            var db = $routeParams.currentDB;
            GetLocks();

            function GetLocks() {
              //new: new Service for default-URL-path.
              // var from = 'NULL';
              // var to = 'NULL';

              //TEST
              // var from = '2018-08-10T10:04';
              // var to = '2018-08-10T10:24';

              // var data = BlockingSessGet.query({db: db, from: from, to: to});
              var data = BlockingSessGetDefault.query({db: db});
              
              // TOFIX: This is not the correct way to wait for the data to load.

              //BSCHEER LAST TOUCHED
              data.$promise.then(function (result) {
                var get_tree = BlockingTree.buildTree(result.items);
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

            // $scope.expandingProperty = {
            //   field: "child_sess_id",
            //   displayName: "Session ID"
            // };
            $scope.expandingProperty = {
              field: "waiting_sess_id",
              displayName: "Session ID"
            };

            // $scope.colDefs = [
            // {
            //   field: "child_sess_id",
            //   displayName: "Session ID"
            // },
            $scope.colDefs = [
            {
              field: "waiting_sess_id",
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
                if (result.items.length == 0) {
                  $scope.noSessions = true;
                }
                else {
                  $scope.noSessions = false;
                  $scope.treedata = BlockingTree.buildTree(result.items);
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

            // $scope.colDefs = [
            // {
            //   field: "child_sess_id",
            //   displayName: "Session ID"
            // },
            $scope.colDefs = [
            {
              field: "waiting_sess_id",
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


// Check if used and delete in later Version!

// BSCHEER: Normal Storage Controller used now. 
// TOFIX: Make StorageInfoCtrl generic. Don't use the following controller. 
// The code is almost the same!
// atlmonJSControllers.controller(
//     'SchemaStorageInfoCtrl',
//     [
//       '$scope',
//       '$location',
//       'StorageInfoGet',
//       'AllSchemasGet',
//       'RegisterSchemas',
//       'RegisterChange',
//       function($scope, $location, StorageInfoGet, AllSchemasGet, RegisterSchemas, RegisterChange) {
//           db = $location.search().db;

//         // TOFIX: data is available later than requested
//         var schemas = RegisterSchemas.getSchemas();

//         var selectedSchema = 'ALL'
//         // var selectedSchema = RegisterChange.getSchema();
//         // $scope.item = RegisterChange.getSchema();

//         // On dropdown item change
//         $scope.update = function() {
//           selectedSchema = $scope.item;
//           queryStorageData();
//         }

//         // radio buttons
//         $scope.radioModel = '2016';
//         $scope.$watch("radioModel", function(newValue, oldValue) {
//           queryStorageData();
//         }, true);


//         function queryStorageData() {
//           var storageInfo = StorageInfoGet.query({db: $routeParams.currentDB,
//                                               schema: selectedSchema,
//                                                 year: $scope.radioModel});
//           $scope.isDataLoaded = false;
//           return storageInfo.$promise.then(function(result) {
//             $scope.storageData = angular.fromJson(result);
//             $scope.isDataLoaded = true;
//           });
//         }
//       }
//     ]);
