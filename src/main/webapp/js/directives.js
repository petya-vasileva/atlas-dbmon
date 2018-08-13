var atlmonJSDirectives = angular.module('atlmonJSDirectives', []);

/** BSCHEER
 * The new directive to build the tables out of the new data structure.
 */
atlmonJSDirectives.directive('ngDbTable', function() {
        return {
            restrict: 'A',
            scope: {
              dbName: '@',
              reduced: '@',
              NrOfNodes: '@'
            },
            template: '\
                  <div ng-if="reduced==\'yes\'" class="headline">\
                  <h4>{{dbName}}</h4>\
                  </div>\
                  <table class="table table-bordered">\
                    <thead>\
                      <tr ng-switch on="NrOfNodes">\
                        <th>Metric</th>\
                        <th>Node1</th>\
                        <th>Node2</th>\
                        <th ng-switch-when="3">Node3</th>\
                        <th ng-switch-when="4">Node3</th>\
                        <th ng-switch-when="4">Node4</th>\
                      </tr>\
                    </thead>\
                    <tbody>\
                      <tr ng-repeat="row in dbMerics | tableType: reduced | toArray:false | orderBy:\'-metric\'">\
                        <td >{{row.metric}}</td>\
                       <td ng-repeat="(key, value) in row" ng-style="alert(value, row)" ng-if="$index < NrOfNodes">\
                          {{value}}\
                        </td>\
                      </tr>\
                    </tbody>\
                  </table>',
            controller: 'BasicInfoCtrl'
        }
    });

/** BSCHEER 
 * The directive that builds the tables with database info. For each DB name it creates dedicated table.
 */
atlmonJSDirectives.directive('ngSessTable', function() {
        return {
            restrict: 'A',
            scope: {
              dbName: '@'
            },
            template: '\
                  <div class="outer-container"><div class="table-container"><table class="table table-bordered fixed_headers">\
                    <thead>\
                      <tr>\
                        <tr ng-switch on="NrOfNodes">\
                          <th><div>Schema</div></th>\
                          <th><div>Node1</div></th>\
                          <th><div>Node2</div></th>\
                          <th ng-switch-when="3"><div>Node3</div></th>\
                          <th ng-switch-when="4"><div>Node3</div></th>\
                          <th ng-switch-when="4"><div>Node4</div></th>\
                          <th><div>Total</div></th>\
                        </tr>\
                      </tr>\
                    </thead>\
                    <tbody>\
                      <tr ng-repeat="row in sessInfo" | toArray:false | orderBy:\'+username\' ng-click="show(row)" \
                      ng-mouseover="rowselected($index)" ng-mouseleave="rowselected()" ng-class="{over : $index == rowNumber}">\
                        <td >{{row.username}}</td>\
                        <td ng-style="alert(value, row)">{{row.node1}}</td>\
                        <td ng-style="alert(value, row)">{{row.node2}}</td>\
                        <td ng-if="NrOfNodes > 2" ng-style="alert(value, row)">{{row.node3}}</td>\
                        <td ng-if="NrOfNodes > 3" ng-style="alert(value, row)">{{row.node4}}</td>\
                        <td >{{row.to_display}}</td>\
                      </tr>\
                    </tbody>\
                  </table></div></div>',
            controller: 'SessDistrCtrl'
        }
    });


atlmonJSDirectives.directive('ngSessionsT1', function() {
        return {
            templateUrl: 'partials/session-details-perapp-andprogr.html',
            // controller: 'SschemaDetailsrCtrl'
        }
    });


atlmonJSDirectives.directive('ngSessionsT2', function() {
        return {
            templateUrl: 'partials/session-details.html',
            // controller: 'SschemaDetailsrCtrl'
        }
    });


atlmonJSDirectives.directive('ngJobs', function() {
        return {
            templateUrl: 'partials/jobs-details.html',
            // controller: 'SschemaDetailsrCtrl'
        }
    });

atlmonJSDirectives.directive('addHtml', function($compile){
  return {
    restrict: 'AE',
    scope: {
          items: '='
        },
    link: function(scope, element, attrs){
      scope.$watch('items', function (newval, oldval) {
        var html = scope.items;

        compiledElement = $compile(html)(scope);

        element.on('click', function(event){
          var pageElement = angular.element(document.getElementById("page"));
          pageElement.empty()
          pageElement.append(compiledElement);
        })
      });
    }
  }
});


atlmonJSDirectives.directive('hcPie',['$location', '$timeout', function (location, $timeout) {
  // return $timeout(function(){
  return {
    restrict: 'E',
    scope: {
      items: '=',
      container: '@',
      title: '@'
    },
    link: function(scope, element, attrs) {

        scope.$watch('items', function (newval, oldval) {
          var chTitle = 'Top SQLs by ' + scope.title;
          if(newval) {
            var serValues = [];
            for(var i=0;i<scope.items.length;i++){
              serValues.push({name: scope.items[i].name, y: scope.items[i].y,
                              schema: scope.items[i].parsing_schema_name,
                              sqlText: scope.items[i].sql_text.substr(0, 100)});
            };
          } 

          chartOptions = {
            chart: {
              renderTo: scope.container,
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              height: 270,
              width: 470,
              type: 'pie'
            },
            exporting: {
              buttons: {
                contextButtons: {
                  enabled: false,
                  menuItems: null
                }
              },
              enabled: false
            },
            colors:[
                  '#286090', '#AA8C30', '#229369', '#981A37', '#FCB319', '#86A033',
                  '#614931', '#3399ff', '#594266', '#cb6828', '#aaaaab', '#a89375'
                  ],
            title: {
              text: chTitle
            },
            tooltip: {
              borderWidth: 0,
              backgroundColor: "rgba(255,255,255,0)",
              borderRadius: 2,
              shadow: false,
              pointFormat: ' <b> {point.schema}: </br> </b> {point.sqlText} . . .',
              useHTML: true,
              positioner: function (labelWidth, labelHeight, point) {
                var tooltipX, tooltipY;
                if (point.plotX + labelWidth > chart.plotWidth) {
                    tooltipX =  chart.plotLeft;
                } else {
                    tooltipX = point.plotX + chart.plotLeft;
                }
                tooltipY = point.plotY + chart.plotTop - 20;
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            }
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: false,
                  color: '#000000',
                  connectorColor: '#000000'
                },
                showInLegend: true,
              }
            },
            legend: {
              itemStyle: {
                 font: '12px "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                 color: '#666666;'
              },
              align: 'right',
              layout: 'vertical',
              verticalAlign: 'top',
              // useHTML: true,
              labelFormatter: function() {
                  return '<div class="pie-legend">' + this.percentage.toFixed(1) + '% - ' + this.name + '</div>'
              },
              x: -50,
              y: 60
            },
            credits: {
              enabled: false
            },
            series: [{
              data: serValues,
              point:{
                events:{
                  click: function() {
                    var path;
                    if (typeof location.search().db == "undefined") {
                      location.search({}); // clean up all query parameters
                      path = location.url() + '/sql_id=' + this.name;
                    } else {
                      path = '/db/' + location.search().db + '/sql_id=' + this.name;
                    }
                    location.url(path);
                    window.location.href = location.absUrl();
                  }
                }
              },
              lang: {
                  noData: "No data to display"
              },
              size: '90%'
            }]
          };

        var chart = new Highcharts.Chart(chartOptions);
        // This is a hack of the highchart. It is neccessary to resize the
        // chart after the data is received, otherwize the chart gets out
        // of the container.
        // TOFIX: It is degrading the performance.
        // There is some delay when clicking on the tabs
        scope.$watch('isDataLoaded', function() {
          resize();
        });

        function resize() {
            height = chart.height
            width = $("#chartRow").width() / 2
            chart.setSize(width, height);
          }

        $(window).resize(function() {
          resize();
        });

      }); // beendet watch
    }
  }; //semikolon evtl entfernen???
// }, 3000);
}]);

atlmonJSDirectives.directive('hcBar', ['$location', '$timeout', function (location, $timeout) {
// return $timeout(function(){
  return {
    restrict: 'E',
    scope: {
      items: '=',
      container: '@',
      db: '='
      // getChartValues: '&getVals'
    },
    link: function(scope, element, attrs) {
      // scope.getChartValues({chartType: scope.type});
      scope.$watch('items', function (newval, oldval) {

        //added delay
        var unit, chTitle, catValues, serValues, palette; //original line
        // $timeout(function(){var unit, chTitle, catValues, serValues, palette;},1000);
        if(newval) {
          chTitle = 'Top SQLs by '+scope.items[0].chart_type;
          unit = scope.items[0].metric_unit;
          catValues = [];
          serValues = [];
          palette = ['#286090', '#AA8C30', '#229369', '#981A37', '#FCB319', '#86A033',
                '#614931', '#00a8e6', '#594266', '#cb6828', '#aaaaab', '#a89375'];
          for(var i=0;i<scope.items.length;i++){
            catValues.push(scope.items[i].name)
            serValues.push({color: palette[i], y: scope.items[i].y,
                            schema: scope.items[i].parsing_schema_name,
                            sqlText: scope.items[i].sql_text.substr(0, 100)});
          };
        }

        chartOptions = {
          chart: {
            renderTo: scope.container,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 270,
            width: 470,
            type: 'bar'
          },
          exporting: {
              buttons: {
                contextButtons: {
                  enabled: false,
                  menuItems: null
                }
              },
              enabled: false
            },
          colors:[
                '#5485BC', '#AA8C30', '#229369', '#981A37', '#FCB319', '#86A033',
                '#614931', '#3399ff', '#594266', '#cb6828', '#aaaaab', '#a89375'
                ],
          title: {
              text: chTitle
          },
          xAxis: {
              categories: catValues,
              title: {
                  text: null
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: unit,
                  align: 'high'
              },
              labels: {
                  overflow: 'justify'
              }
          },
          tooltip: {
              borderWidth: 0,
              backgroundColor: "rgba(255,255,255,0)",
              borderRadius: 2,
              shadow: false,
              pointFormat: ' <b> {point.schema}: </br> </b> {point.sqlText} . . .',
              useHTML: true
          },
          plotOptions: {
              bar: {
                  dataLabels: {
                      enabled: true
                  }
              },
              series: {
                  stacking: 'normal',
                  pointWidth: 15,
                  pointPadding: -5
              }
          },
          credits: {
              enabled: false
          },
          legend: {
              enabled: false
          },
          series: [{
              data: serValues,
              point:{
                events:{
                  click: function (event) {
                    var path;
                    if (typeof location.search().db == "undefined") {
                      location.search({}); // clean up all query parameters
                      path = location.url() + '/sql_id=' + this.category;
                    } else {
                      path = '/db/' + location.search().db + '/sql_id=' + this.category;
                    }
                    location.url(path);
                    window.location.href = location.absUrl();
                  }
                }
              }
          }],
          lang: {
                  noData: "No data to display"
              },
        };

        var chart = new Highcharts.Chart(chartOptions); 

        function resize() {
          height = chart.height
          width = $("#chartRow").width() / 2
          chart.setSize(width, height);
        }

        $(window).resize(function() {
          resize();
        });

        // This is a hack of the highchart. It is neccessary to resize the
        // chart after the data is received, otherwize the chart gets out
        // of the container.
        // TOFIX: It is degrading the performance.
        // There is some delay when clicking on the tabs.
        scope.$watch('isDataLoaded', function() {
          resize();
        });

      });
  
    }
  }; // Semikolon? ^^
// }, 3000);
}]);

// BSCHEER - DONE
atlmonJSDirectives.directive('hcLine', function() {
  return {
    restrict: 'E',
    scope: {
      items: '='
    },
    link: function(scope, element, attrs) {
      // scope.getChartValues({chartType: scope.type});
      scope.$watch('items', function (newval, oldval) {
        if(newval) {
          var catValues = [];
          var series1 = [];
          var series2 = [];

          for(var i=0;i<scope.items.length;i++){
            catValues.push(Object.values(scope.items[i])[0])
            series1.push(Object.values(scope.items[i])[1]);
            series2.push(Object.values(scope.items[i])[2]);
            
          };

          var chart = new Highcharts.Chart({
              chart: {
                renderTo: 'storage-container',
                type: 'line',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                spacingRight: 5,
                height: 370,
                width: 500
              },
              title: {
                text: 'Database volume'
              },
              colors:['#229369', '#00526F'],
              xAxis: { // Primary / Left
                categories: catValues
              },
              yAxis: {
                title: {
                  text: 'Size in GB'
                },
              },
              tooltip: {
                  valueSuffix: ' GB'
              },
              plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true
                  },
                  enableMouseTracking: true
                }
              },
              series: [{
                name: 'Table',
                data: series1,
              }, {
                name: 'Index',
                data: series2
              }]
          });

        function resize() {
          height = chart.height;
          width = $(".chart-wrapper").width();
          chart.setSize(width, height);
        }

        $(window).resize(function() {
          resize();
        });

        scope.$watch('isDataLoaded', function() {
          resize();
        });

      }});
    }
  }
});


atlmonJSDirectives.directive('hcArea', function() {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      type: '@',
      container: '@',
      unit: '@',
      i: '@',
    },
    link: function(scope, element, attrs) {
      scope.$watch('items', function (newval, oldval) {
        if(newval) {
          // We need to set the Date.UTC in order to have the plots displayed in local time.
          var data, seriesf = [];
          var year, month, hour, minute, second;
          for(var i=0;i<scope.items.length;i++){
            t_stamp = new Date(scope.items[i].t_stamp);
            year = t_stamp.getFullYear();
            month = t_stamp.getMonth();
            day = t_stamp.getDate();
            hour = t_stamp.getHours();
            minute = t_stamp.getMinutes();
            second = t_stamp.getSeconds();
            seriesf[i] = [Date.UTC(year, month, day, hour, minute, second), scope.items[i].metric_value];
          };

          var chart = new Highcharts.Chart({
           chart: {
              renderTo: scope.container,
              type: 'area',
              zoomType: 'x',
              height: 270,
              // width: 500
            },
            credits: {
              enabled: false
            },
            title: {
              text: scope.type
            },
            xAxis: {
              type: 'datetime',
              ordinal: true
            },
            yAxis: {
              min: 0,
              labels: {
                formatter: function() {
                  return this.value;
                }
              },
              title: {
                text: scope.unit
              }
            },
            global: {
                useUTC: false
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%e-%b-%Y', new Date(this.x)) + '<br/>' + Highcharts.dateFormat('%H:%M:%S', new Date(this.x)) + ' <br/> Value:<b>' + this.y + '</b>';
                }
            },
            plotOptions: {
              area: {
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                  },
                  stops: [
                    [0, Highcharts.getOptions().colors[scope.i]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[scope.i]).setOpacity(0).get('rgba')]
                  ]
                },
                marker: {
                  radius: 2
                },
                lineWidth: 1,
                states: {
                  hover: {
                    lineWidth: 1
                  }
                },
                threshold: null
              }
            },
            series: [{
                color: Highcharts.getOptions().colors[scope.i],
                showInLegend: false,
                turboThreshold: 10000000,
                data: seriesf,
                pointStart: seriesf[0][0],
                tooltip: {
                    // yDecimals: 4,
                    formatter: function() {
                        var d = new Date(parseInt(this.x));
                        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                    }
                },
              }]
        });

        function resize() {
          height = chart.height;
          width = $(".chart").width();
          chart.setSize(width, height);
        }

        $(window).resize(function() {
          resize();
        });

        scope.$watch('items', function() {
          resize();
        });

      }});
    }
  }
});


atlmonJSDirectives.directive('hcSessArea', function() {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      schema: '@',
      container: '@',
      i: '@',
    },
    link: function(scope, element, attrs) {
      scope.$watch('items', function (newval, oldval) {
        if(newval) {
          // We need to set the Date.UTC in order to have the plots displayed in local time.
          var data, total = [], active = [];
          var year, month, hour, minute;
          for(var i=0;i<scope.items.length;i++){
            t_stamp = new Date(scope.items[i].t_stamp);
            year = t_stamp.getFullYear();
            month = t_stamp.getMonth();
            day = t_stamp.getDate();
            hour = t_stamp.getHours();
            minute = t_stamp.getMinutes();
            total[i] = [Date.UTC(year, month, day, hour, minute), scope.items[i].num_sess];
            active[i] = [Date.UTC(year, month, day, hour, minute), scope.items[i].num_active_sess];
          };

          var chart = new Highcharts.Chart({
           chart: {
              renderTo: scope.container,
              type: 'line',
              zoomType: 'x',
              // height: 270,
              width: 1000
            },
            credits: {
              enabled: false
            },
            title: {
              text: "Number of sessions for " + scope.schema
            },
            xAxis: {
              type: 'datetime',
              ordinal: true
            },
            yAxis: {
              min: 0,
              labels: {
                formatter: function() {
                  return this.value;
                }
              }
            },
            global: {
                useUTC: false
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%e-%b-%Y', new Date(this.x)) + '<br/>' + 
                           Highcharts.dateFormat('%H:%M:%S', new Date(this.x)) + ' <br/> Value:<b>' + 
                           this.y + '</b>';
                }
            },
            plotOptions: {
              area: {
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                  },
                  stops: [
                    [0, Highcharts.getOptions().colors[scope.i]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[scope.i]).setOpacity(0).get('rgba')]
                  ]
                },
                marker: {
                  radius: 2
                },
                lineWidth: 1,
                states: {
                  hover: {
                    lineWidth: 1
                  }
                },
                threshold: null
              }
            },
            series: [{
                name: 'Total number of sessions',
                data: total
                }, {
                name: 'Active sessions',
                data: active
            }]
        });

      }});
    }
  }
});