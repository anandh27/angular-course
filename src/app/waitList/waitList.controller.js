(function() {
  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  waitListController.$inject = ['FIREBASE_URL', 'partyService'];

  function waitListController(FIREBASE_URL, partyService) {
    var vm = this;
    var fireTextMessages = new Firebase(FIREBASE_URL + 'textMessages');

    vm.newParty = new partyService.Party();
    vm.parties = partyService.parties;
    vm.addParty = addParty;
    vm.removeParty = removeParty;
    vm.sendTextMessage = sendTextMessage;
    vm.toggleDone = toggleDone;

    function addParty() {
      vm.parties.$add(vm.newParty);

      vm.newParty = new partyService.Party();
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
