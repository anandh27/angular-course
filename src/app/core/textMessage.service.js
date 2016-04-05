(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('textMessageService', textMessageService);

  textMessageService.$inject = ['firebaseDataService'];

  function textMessageService(firebaseDataService) {
    var service = {
      sendTextMessage: sendTextMessage
    };

    return service;

    function sendTextMessage(party, parties) {
      var newTextMessage = {
        phoneNumber: party.phone,
        name: party.name,
        size: party.size
      };

      firebaseDataService.textMessages.push(newTextMessage);
      party.notified = true;
      parties.$save(party);
    }
  }
})();
