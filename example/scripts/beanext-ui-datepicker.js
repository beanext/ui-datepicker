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

angular.module('bui.datepicker', []).directive('buiDatepicker', ['$compile', '$parse', function ($compile, $parse) {
  return {
    restrict: 'AE',
    require: '?ngModel',
    template: '<bui-datepicker-container></bui-datepicker-container>',
    replace: true,
    link: function (scope, element, attr, ngModel) {
      var SNAKE_CASE_REGEXP = /[A-Z]/g;
      ngModel = ngModel ? ngModel : {'$setViewValue': angular.noop}
      function snake_case(name, separator) {
        separator = separator || '_';
        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
          return (pos ? separator : '') + letter.toLowerCase();
        });
      }

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
      var showOk = attr.showOk? attr.showOk === 'true' : true;
      var showToday = attr.showToday? attr.showToday === 'true' : true;

      var config = {
        isShowClear:showClear,
        isShowOk:showOk,
        isShowToday:showToday,
        oncleared: function () {
          scope.$apply(function () {
            ngModel.$setViewValue('');
          });
        },
        onpicked: changeVal,
        dchanged: valueChanged,
        Mchanged: valueChanged,
        ychanged: valueChanged,
        Hchanged: valueChanged,
        mchanged: valueChanged,
        schanged: valueChanged,
        skin: 'ext',
        dateFmt: 'yyyy-MM-dd'
      };
      if (attr.dateFmt) {
        try {
          config.dateFmt = $parse(attr.dateFmt)(scope);
        } catch (e) {
        }
        if (!angular.isString(config.dateFmt)) {
          config.dateFmt = attr.dateFmt;
        }
      }
      angular.forEach(['minDate', 'maxDate'], function (prop) {
        if (attr[prop]) {
          var propVal = attr[prop];
          config[prop] = {};
          try {
            config[prop].value = $parse(propVal)(scope);
            config[prop].varible = propVal;
          } catch (e) {
            config[prop].value=propVal;
          }
          if(config[prop].value === undefined) {
            config[prop].value = "";
          }
        }
      });

      var repaintInput = function (newVal, val) {
        var input = angular.element("<input type='text'/>");
        var div = angular.element("<div></div>");
        div.append(input);
        for (var a in attr) {
          if (a !== 'buiDatepicker') {
            try {
              input.attr(snake_case(a, '-'), attr[a]);
            } catch (e) {
            }
          }
        }
        input = $compile(div.html())(scope);
        element.empty();
        element.append(input);
        input.bind('change', function () {
          scope.$apply(function () {
            ngModel.$setViewValue(input.val());
          });
        });

        input.bind('click', function () {
          var options = {};
          var refresh;
          for(var name in config) {
            if(angular.isObject(config[name])){
              if(config[name].varible){
                var newVal;
                try {
                  newVal = $parse(config[name].varible)
                } catch(e){}
                if(config[name].value !== newVal) {
                  refresh = true;
                  config[name].value = newVal;
                }
              } else {
                if(config[name].value!==undefined) {
                  options[name] = config[name].value;
                } else {
                  options[name] = config[name];
                }
              }
            } else {
              options[name] = config[name];
            }
          }
          window.WdatePicker(options);
        });

        input.attr('readOnly', 'readOnly');
        if (element.hasClass('form-control')) {
          var feedEL = '<span class="fa fa-calendar fa-lg form-control-feedback" style="padding-top: 10px;"></span>';
          element.removeClass('form-control').parent().addClass('has-feedback')
          input.addClass('form-control')
          input.before(feedEL);
        }

      }
      scope.$watch(config, repaintInput, true);
    }
  };
}]);
