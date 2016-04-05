(function() {
  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  waitListController.$inject = ['partyService', 'textMessageService'];

  function waitListController(partyService, textMessageService) {
    var vm = this;

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
      textMessageService.sendTextMessage(party, vm.parties);
    }

    function toggleDone(party) {
      vm.parties.$save(party);

      console.log(party);
    }

  }
})();
