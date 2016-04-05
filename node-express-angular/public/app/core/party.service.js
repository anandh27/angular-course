(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('partyService', partyService);

  partyService.$inject = ['$http'];

  function partyService($http) {
    var service = {
      Party: Party,
      addParty: addParty,
      removeParty: removeParty
    };

    return service;

    ///////////////

    function Party() {
      this.name = '';
      this.phone = '';
      this.size = '';
      this.done = false;
      this.notified = false;
    }

    function addParty(vm, Party) {
      $http.post('/api/v1/parties', {name: vm.party.name, phone: vm.party.phone, size: vm.party.size})
        .success(function(data) {
          vm.party = new Party();

          vm.parties = data;
          console.log(data);
        })
        .error(function(error) {
          console.log(error);
        });
    }

    function removeParty(party, vm) {
      $http.delete('api/v1/parties/' + party.id)
        .success(function(data) {
          vm.parties = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }

  }
})();
