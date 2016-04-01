(function() {
  'use strict';

  angular
    .module('app.auth')
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$location', '$firebaseAuth'];

  function AuthController($location, $firebaseAuth) {
    var vm = this;
    var firebaseReference = new Firebase('https://waitandeat-tja-node.firebaseio.com/');
    var firebaseAuthObject = $firebaseAuth(firebaseReference);

    vm.user = {
      email: '',
      password: ''
    };

    vm.register = register;
    vm.login = login;
    vm.logout = logout;

    function register(user) {
      return firebaseAuthObject.$createUser(user)
        .then(function() {
          vm.login(user);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function login(user) {
      return firebaseAuthObject.$authWithPassword(user)
        .then(function(loggedInUser) {
          console.log(loggedInUser);
          $location.path('/waitlist');
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function logout() {
      console.log("Logging Out");
      firebaseAuthObject.$unauth();
      $location.path('/');
    }

  }
})();
