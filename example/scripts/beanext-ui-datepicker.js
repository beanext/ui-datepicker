/**
 * Created by michael on 15-11-13.
 */
//'use strict';

/**
 * @ngdoc overview
 * @name bui.datepicker
 * @description
 * # Beanext UI Component datepicker
 */
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'bui.datepicker';
}
angular.module('bui.datepicker', []).directive('buiDatepicker', [function () {
  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      minDateFunc: '&?',
      maxDateFunc: '&?',
      lang: '=?'
    },
    link: function (scope, element, attr, ngModel) {
      ngModel = ngModel || {
          '$setViewValue': angular.noop
        };
      if (element.hasClass('form-control')) {
        var feedEL = '<span class="fa fa-calendar fa-lg form-control-feedback" style="padding-top: 10px;"></span>';
        element.parent().addClass('has-feedback');
        element.before(feedEL);
      }
      element.attr('readOnly', 'readOnly');
      element.bind('change', function () {
        scope.$apply(function () {
          ngModel.$setViewValue(element.val());
        });
      });

      var changeVal = function (dp) {
        var date = dp.cal.getNewDateStr();
        scope.$apply(function () {
          ngModel.$setViewValue(date);
        });
      };
      var valueChanged = function () {
        return changeVal(window.$dp);
      };
      var showClear = attr.showClear ? attr.showClear === 'true' : true;
      var showOk = attr.showOk ? attr.showOk === 'true' : true;
      var showToday = attr.showToday ? attr.showToday === 'true' : true;
      element.bind('click', function () {
        var options = {
          oncleared: function () {
            scope.$apply(function () {
              ngModel.$setViewValue('');
            });
          },
          isShowClear: showClear,
          isShowOk: showOk,
          isShowToday: showToday,
          onpicked: changeVal,
          dchanged: valueChanged,
          Mchanged: valueChanged,
          ychanged: valueChanged,
          Hchanged: valueChanged,
          mchanged: valueChanged,
          schanged: valueChanged,
          skin: 'ext',
          dateFmt: attr.dateFmt || 'yyyy-MM-dd',
        };
        if (attr.minDate) {
          options.minDate = attr.minDate;
        }
        if (attr.maxDate) {
          options.maxDate = attr.maxDate;
        }
        if (attr.minDateFunc) {
          options.minDate = scope.minDateFunc();
        }
        if (attr.maxDateFunc) {
          options.maxDate = scope.maxDateFunc();
        }
	if(scope.lang){
	  options.lang = scope.lang;
	}
        window.WdatePicker(options);
      });
    }
  };
}]);
