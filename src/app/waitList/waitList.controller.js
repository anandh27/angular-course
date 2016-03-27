(function() {
  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  waitListController.$inject = ['$firebaseArray'];

  function waitListController($firebaseArray) {
    var vm = this;
    var fireParties = new Firebase('https://waitandeat-thomas.firebaseio.com/parties');

    function Party() {
      this.name = '';
      this.phone = '';
      this.size = '';
      this.done = false;
      this.notified = false;
    }

    vm.newParty = new Party();
    vm.parties = $firebaseArray(fireParties);
    vm.addParty = addParty;
    vm.removeParty = removeParty;

    function addParty() {
      vm.parties.$add(vm.newParty);

      vm.newParty = new Party();
    }

    function removeParty(party) {
      vm.parties.$remove(party);
    }

  }
})();
