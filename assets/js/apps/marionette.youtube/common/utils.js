/**
 * utilities modules - AMD sugared syntax
 * @param  {Object} require
 * @return {Object}
 */
define(function (require) {

  'use strict';

  return {

    /**
     * Parse integer seconds to string time format - TODO: move to utilities module
     * @param  {Number} seconds
     * @return {String}
     */
    getDuration: function (seconds) {
      var minutes;
      var hours;

      hours = parseInt(seconds / 3600);
      seconds = seconds % 3600;
      minutes = '' + parseInt(seconds / 60, 10);
      seconds = '' + (seconds % 60);
      seconds = Array(3 - seconds.length).join('0') + seconds;
      minutes = Array(3 - minutes.length).join('0') + minutes;
      return (hours ? hours + ':' : '') + minutes + ':' + seconds;
    }
  };
});