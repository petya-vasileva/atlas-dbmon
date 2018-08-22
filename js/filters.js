var atlmonJSFilters = angular.module('atlmonJSFilters', []);

/**
 * Custom filter for reducing the number of returned rows. 
 * If the variable "reduced" takes value "yes", 
 * then the shown metrics are only those, which have visible='Y' returned by the 
 * BasicInfoCtrl.dbMerics
 */
atlmonJSFilters.filter('tableType', function () {
    return function (items, reduced) {
        var filtered = [];
        if (reduced === 'yes') {
          for (var i = 0; i < items.length; i++) {
              var item = items[i];
              // console.log(reduced);
              if (item.visible === 'Y') {
                  filtered.push(item);
              }
          }
        } else filtered = items;
        return filtered;
    };
});