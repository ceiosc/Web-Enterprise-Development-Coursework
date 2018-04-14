angular.module('mainCtrl', [])
    .controller('mainController', function ($rootScope, $scope, $location, Auth, User) {
        var vm = this;
        
        // get info if a person is logged in
        vm.loggedIn = Auth.isLoggedIn();
        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function () {
            vm.loggedIn = Auth.isLoggedIn();
            // get user information on page load
            Auth.getUser()
                .then(function (data) {
                    vm.user = data.data;
                });
        });
        //Initial Setup on page load
        vm.initialiseLoginPage = function () {
            vm.create = false;
            vm.login = false;
            vm.welcome = true;
        }        

        //Shows the login page when login pressed
        vm.showLogin = function () {
            vm.welcome = false;
            vm.existing = true;
        };
        //Hides the login page when login pressed
        vm.hideLogin = function () {
            vm.welcome = true;
            vm.existing = false;
            vm.clearLogin();
        };
        //Shows the create user page when create pressed
        vm.showCreate = function () {
            vm.welcome = false;
            vm.create = true;
        }
        //Hides the create user page when create pressed
        vm.hideCreate = function () {
            vm.welcome = true;
            vm.create = false;
            vm.clearCreate()
        };

        //Clear the create user form
        vm.clearCreate = function () {
            vm.userData.username.text = '';
            vm.userData.username = '';
            vm.userData.password = '';
        };
        //Clear the login user form
        vm.clearLogin = function () {
            vm.loginData.username = '';
            vm.loginData.password = '';
            vm.error = '';
        }
        // function to handle login form
        vm.doLogin = function () {
            vm.processing = true;
            // clear the error
            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .then(function (data) {
                    vm.processing = false;
                    // if a user successfully logs in, redirect to users page
                    if (data.data.success) {//Get authorised users id
                        Auth.getUser().success(function (user) {
                            console.log("Auth");
                            $location.path('/game/' + user.id);
                        });
                    }
                    else {
                        vm.error = data.data.message;
                        vm.rerender;
                    }
                });
        }

        // function to handle logging out
        vm.doLogout = function () {
            Auth.logout();
            vm.user = '';
            $location.path('/login');
        };

        vm.createSample = function () {
            Auth.createSampleUser();
        };

        // function to create a user
        vm.saveUser = function () {
            vm.processing = true;

            // clear the message
            vm.message = '';

            // use the create function in the userService
            User.create(vm.userData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form
                    vm.userData = {};
                    vm.message = data.message;
                    vm.existing = true;
                    vm.create = false;
                });
        };


    });