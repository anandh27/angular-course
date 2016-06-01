(function() {
  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  waitListController.$inject = ['partyService', 'user'];

  function waitListController(partyService, user) {
    var vm = this;

    console.log(user);

    vm.parties = partyService.getPartiesByUser(user.uid);

  }
})();
