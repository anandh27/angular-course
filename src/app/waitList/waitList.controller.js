(function() {
  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  waitListController.$inject = ['$firebaseArray'];

  function waitListController($firebaseArray) {
    var vm = this;
    var fireParties = new Firebase('https://waitandeat-thomas.firebaseio.com/parties');
    var fireTextMessages = new Firebase('https://waitandeat-thomas.firebaseio.com/textMessages');

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
    vm.sendTextMessage = sendTextMessage;
    vm.toggleDone = toggleDone;

    function addParty() {
      vm.parties.$add(vm.newParty);

      vm.newParty = new Party();
    }

    function removeParty(party) {
      vm.parties.$remove(party);
    }

    function sendTextMessage(party) {

      var newTextMessage = {
        phoneNumber: party.phone,
        name: party.name,
        size: party.size
      };

      fireTextMessages.push(newTextMessage);
      party.notified = true;
      vm.parties.$save(party);
    }

    function toggleDone(party) {
      vm.parties.$save(party);

      console.log(party);
    }

  }
})();
