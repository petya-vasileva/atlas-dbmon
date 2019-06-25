var atlmonJSDirectives = angular.module('atlmonJSDirectives', []);

/** 
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

            templateUrl: 'partials/db-table.html'
            // controller:  'BasicInfoCtrl'
        }
    });

/**  
 * The directive that builds the tables with database info. For each DB name it creates dedicated table.
 */
atlmonJSDirectives.directive('ngSessTable', function() {
        return {
            restrict: 'A',
            scope: {
              dbName: '@'
            },
            templateUrl: 'partials/session-distribution-table.html',
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
            controller: 'JobsInfoCtrl'
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
            height = chart.height;
            width = $("#chartRow").width() / 2
            chart.setSize(width, height);
          }

        $(window).resize(function() {
          resize();
        });

        window.onresize = function(event) {
          resize();
        };

      }); // beendet watch
    }
  };
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

        var unit, chTitle, catValues, serValues, palette; //original line
        // $timeout(function(){var unit, chTitle, catValues, serValues, palette;},1000);
        if(newval) {
          if(scope.items.length > 0){
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
        window.onresize = function(event) {
          resize();
        };


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
                spacingRight: 15,
                height: 315,
                // width: 500
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
      snode: '@'
    },
    link: function(scope, element, attrs) {
      scope.$watch('items', function (newval, oldval) {
        if(newval) {
          // We need to set the Date.UTC in order to have the plots displayed in local time.
          var seriesData = [];
          var num_nodes = Object.keys(scope.items).length;
          // Dynamically build a JSON object for each node as required by Highcharts
          for(var i=0; i<num_nodes; i++){
            item = {
                    animation: false,
                    name: Object.keys(scope.items)[i].toUpperCase(),
                    data: Object.values(scope.items)[i]
                   };
            seriesData.push(item);
          };

          var chart = new Highcharts.Chart({
           chart: {
              renderTo: scope.container,
              type: 'area',
              zoomType: 'x',
              height: 280,
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
            colors:[
                  '#286090', '#981A37', '#FCB319', '#229369',
                  '#614931', '#3399ff', '#594266'
                  ],
            plotOptions: {
              area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
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
            loading: {
                style: {
                    backgroundColor: 'white',
                    "opacity": 0.8
                }
            },
            series: [{
                color: Highcharts.getOptions().colors[scope.i],
                showInLegend: false,
                turboThreshold: 10000000,
                data: [],
                // pointStart: seriesf[0][0],
                tooltip: {
                    // yDecimals: 4,
                    formatter: function() {
                        var d = new Date(parseInt(this.x));
                        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                    }
                },
              }]
          });

        // Add all series to the chart
        for(var j=0; j<num_nodes; j++){
          chart.addSeries(seriesData[j]);
        };

        // Hide simultaneously a specific node for all charts on NodeN button click
        scope.$watch('snode', function(newValue, oldValue) {
          chart.showLoading();

          setTimeout(() => {
            for(var j=0; j<=num_nodes; j++){
              if (newValue != j && newValue != 0){
                chart.series[j].hide();
              }
              else {
                chart.series[j].show();
              }
            };
            chart.hideLoading();
           }, 500);
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
              height: 270,
              // width: 1000
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


atlmonJSDirectives.directive('hcStacked', function() {
  return {
    restrict: 'E',
    scope: {
      items: '='
    },
    link: function(scope, element, attrs) {
      scope.$watch('items', function (newval, oldval) {

        if(newval) {

          var chart = new Highcharts.chart({

            chart: {
              renderTo: 'tt-container',
              type: 'area',
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              spacingRight: 5,
              height: 335,
              // reflow: true
            },
            colors: [
              '#5485BC', '#AA8C30', '#229369', '#981A37', '#FCB319', '#86A033',
              '#614931', '#3399ff', '#594266', '#cb6828', '#aaaaab', '#a89375'
            ],
            title: {
              text: 'Top 10 Tables by storage size (Gb)'
            },
            subtitle: {
              text: ''
            },
            xAxis: {
              categories: scope.items[1],
              tickmarkPlacement: 'on',
              title: {
                enabled: false
              }
            },
            yAxis: {
              title: {
                text: 'Gigabytes'
              }
            },
            tooltip: {
              split: true,
              valueSuffix: ' GB'
            },
            plotOptions: {
              area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                  lineWidth: 1,
                  lineColor: '#666666'
                }
              }
            },
            loading: {
              style: {
                backgroundColor: 'black',
                "opacity": 0.8
              }
            },
            series: scope.items[0]
        });

        scope.$watch('isDataLoaded', function() {
          resize();
        });

        function resize() {
            height = chart.height;
            width = $("#chart-wrap").width()
            chart.setSize(width, height);
          }

        $(window).resize(function() {
          resize();
        });

        window.onresize = function(event) {
          resize();
        };

      }});
    }
  }
});
