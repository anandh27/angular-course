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
  }
})();
