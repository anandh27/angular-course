(function() {
  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  function waitListController() {
    var vm = this;

    vm.parties = [1, 2, 3, 4];

    vm.addParty = addParty;

    function addParty() {
      vm.parties.push('another');
    }
  }
})();
