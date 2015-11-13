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
angular.module('bui.datepicker', []).directive('buiDatepicker', function () {
  return {
    restrict: 'A',
    require: '?ngModel',
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
      element.bind('click', function () {
        var options = {
          oncleared: function () {
            scope.$apply(function () {
              ngModel.$setViewValue('');
            });
          },
          onpicked: function (dp) {
            var date = dp.cal.getNewDateStr();
            scope.$apply(function () {
              ngModel.$setViewValue(date);
            });
          },
          skin: 'ext',
          dateFmt: attr.dateFmt || 'yyyy-MM-dd',
        };
        if (attr.minDate) {
          options.minDate = attr.minDate;
        }
        if (attr.maxDate) {
          options.maxDate = attr.maxDate;
        }
        window.WdatePicker(options);
      });
    }
  };
});
