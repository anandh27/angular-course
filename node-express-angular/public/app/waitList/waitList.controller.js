(function() {
  'use strict';

  angular
    .module('app.waitList')
    .controller('waitListController', waitListController);

  waitListController.$inject = ['$http'];

  function waitListController($http){
    var vm = this;

    function Party() {
      this.name = '';
      this.phone = '';
      this.size = '';
      this.done = false;
      this.notified = false;
    }

    vm.party = new Party();

    $http.get('/api/v1/parties')
      .success(function(data) {
        vm.parties = data;
        console.log(data);
      })
      .error(function(error){
        console.log('Error: ' + error);
      });

    vm.addParty = function() {
      $http.post('/api/v1/parties', {name: vm.party.name, phone: vm.party.phone, size: vm.party.size})
        .success(function(data) {
          vm.party = new Party();

          vm.parties = data;
          console.log(data);
        })
        .error(function(error) {
          console.log(error);
        });
    };

    vm.removeParty = removeParty;
    vm.sendTextMessage = sendTextMessage;
    vm.toggleDone = toggleDone;

    function removeParty(party) {
      $http.delete('api/v1/parties/' + party.id)
        .success(function(data) {
          vm.parties = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
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
