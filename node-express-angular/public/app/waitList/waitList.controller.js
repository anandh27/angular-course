(function() {
  'use strict';

  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  waitListController.$inject = ['$http', 'partyService'];

  function waitListController($http, partyService) {
    var vm = this;

    $http.get('/api/v1/parties')
      .success(function(data) {
        vm.parties = data;
        console.log(data);
      })
      .error(function(error){
        console.log('Error: ' + error);
      });

    vm.party = new partyService.Party();
    vm.addParty = addParty;
    vm.removeParty = removeParty;
    vm.sendTextMessage = sendTextMessage;
    vm.toggleDone = toggleDone;


    function addParty() {
      partyService.addParty(vm, partyService.Party);
    }

    function removeParty(party) {
      partyService.removeParty(party, vm);
    }


    function sendTextMessage(party) {
      $http.post('/message', { name: party.name, phone: party.phone, size: party.size })
        .success(function(data) {
          party.notified = true;
          console.log('Data: ' + data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });


      $http.put('/api/v1/parties/' + party.id +'/notify',
                {name: party.name, phone: party.phone, size: party.size, notified: party.notifed, done: party.done})
        .success(function(data) {
          vm.parties = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }

    function toggleDone(party){
      $http.put('/api/v1/parties/' + party.id +'/done',
                {done: party.done})
        .success(function(data) {
          vm.parties = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }
  }
})();
