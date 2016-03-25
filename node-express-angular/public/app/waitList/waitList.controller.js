(function() {
  'use strict';

  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  function waitListController(){
    var vm = this;

    vm.parties = [1,2,3,4];
  }
})();
