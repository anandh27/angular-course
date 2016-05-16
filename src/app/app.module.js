(function(){
  'use strict';

  angular
    .module("app",[
      // Angular modules
      'ngRoute',

      // Third party modules
      'firebase',

      // Custom modules
      'app.landing',
      'app.layout',
      'app.waitList',
      'app.auth',
      'app.core'
    ]);
})();
