/*!
 * qdate.js version: v1.0.0; author : Wangpq;
 * drcal : 一个生成日历的简易插件
 * Date: 2017-07-17T11:30Z
 */
;(function ($) {
  var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  function pad(n) {
    var n_ = n.toString();
    return new Array(3 - n_.length).join('0') + n_;
  }

  function iso8601(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function renderWeek(date) {
    var day = date;
    var week = $('<tr></tr>');
    for (var i = 0; i < 7; i++) {
      var cell = $('<td date="' + iso8601(day) + '" year="' + day.getFullYear() + '" month="' + (day.getMonth() + 1) + '" day="' + day.getDate() + '"></td>').appendTo(week);
      day = new Date(day.getTime() + 86400000);
    }
    return week;
  }

  $.drcal = function () {
    var weeks = [];
    var table = $(
      '<table class="calendar">'
      + '<thead>'
        + '<tr>'
          + '<th colspan="7" class="header">'
            + '<span class="prev"></span>'
            + '<span class="monthyear"></span>'
            + '<span class="next"></span>'
          + '</th>'
        + '</tr>'
      + '</thead>'
      + '<tbody></tbody>'
    + '</table>');

    $('<tr>' + $.map(weekdays, function (x) {
      return '<th>' + x + '</th>'
    }).join('') + '</tr>').appendTo(table.find('thead'));

    table.year = function () {
      return table.attr('year') ? parseInt(table.attr('year'), 10) : null;
    };
    table.month = function () {
      return table.attr('month') ? parseInt(table.attr('month'), 10) : null;
    };
    table.findCell = function (date) {
      return table.find('[date="' + iso8601(date) + '"]');
    };
    table.changeMonth = function (date) {
      // Find the week that this month begins on.
      var first = new Date(date.getFullYear(), date.getMonth(), 1);
      var weekStart = new Date(first.getTime() - (first.getDay() * 86400000));
      var week = weekStart;
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var year = date.getFullYear();
      var month = date.getMonth();

      // Detach any existing weeks.
      //$('tbody > tr', table).detach();
      $('tbody', table).empty();
      do {
        // If this month has already been rendered in the cache, use it.
        var tr = weeks[iso8601(week)];
        var rendered = false;
        if (!tr) { // Render.
          rendered = true;
          tr = renderWeek(week);
          weeks[iso8601(week)] = tr;
        }
        // Either way, we need to run through each day and set some classes.
        $('td', tr).each(function (_, td) {
          var _td=$(td);
          _td.removeClass('today').removeClass('extra').html('<span class="text">' + _td.attr('day') + '</span>');
          if (_td.attr('date') === iso8601(today)) {
            _td.addClass('today');
          }
          if (_td.attr('month') != month + 1) {
            _td.addClass('extra');
          }
        });
        $('tbody', table).append(tr);
        if (rendered) {
          table.trigger('drcal.weekRender', [tr]);
        }
        week = new Date(week.getTime() + 86400000 * 7);
      } while (week.getMonth() === date.getMonth());
      table.attr('year', year);
      table.attr('month', month + 1);
      table.find('.monthyear').html(year+"年"+months[month]+"月");
      //table.trigger('drcal.monthChange', []);
    };

    table.find('.prev').click(function () { 
      table.changeMonth(new Date(table.year() - (table.month() === 1  ? 1 : 0), table.month() === 1 ? 11 : table.month() - 2, 1));
    });
    table.find('.next').click(function () {
      table.changeMonth(new Date(table.year() + (table.month() === 12 ? 1 : 0), table.month() === 12 ? 0 : table.month(), 1));
    });

    return table;
  };
})(window.jQuery || window.Zepto);
