angular.module('app.routes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            // home page route
            .when('/', {
                templateUrl: 'app/views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            })

            // login page 
            .when('/login', {
                templateUrl: 'app/views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            })

            // show all users
            .when('/users', {
                templateUrl: 'app/views/pages/users/all.html',
                controller: 'userController',
                controllerAs: 'user'
            })

            // form to create a new user, same view as edit page
            .when('/users/create', {
                templateUrl: 'app/views/pages/users/single.html',
                controller: 'userCreateController',
                controllerAs: 'user'
            })

            // page to edit a user
            .when('/users/:user_id', {
                templateUrl: 'app/views/pages/users/single.html',
                controller: 'userEditController',
                controllerAs: 'user'
            })

            //Form to create a new item, same view as edit page
            .when('/items', {
                templateUrl: 'app/views/pages/items/all.html',
                controller: 'itemController',
                controllerAs: 'item'
            })

            //Form to create a new item, same view as edit page
            .when('/items/create', {
                templateUrl: 'app/views/pages/items/single.html',
                controller: 'itemCreateController',
                controllerAs: 'item'
            })

            // page to edit an item
            .when('/items/:item_id', {
                templateUrl: 'app/views/pages/items/single.html',
                controller: 'itemEditController',
                controllerAs: 'item'
            })

            //Form to create a new creature, same view as edit page
            .when('/creatures', {
                templateUrl: 'app/views/pages/creatures/all.html',
                controller: 'creatureController',
                controllerAs: 'creature'
            })

            //Form to create a new creature, same view as edit page
            .when('/creatures/create', {
                templateUrl: 'app/views/pages/creatures/single.html',
                controller: 'creatureCreateController',
                controllerAs: 'creature'
            })

            // page to edit a creature
            .when('/creatures/:creature_id', {
                templateUrl: 'app/views/pages/creatures/single.html',
                controller: 'creatureEditController',
                controllerAs: 'creature'
            })

            //Form to create a new creature, same view as edit page
            .when('/spells', {
                templateUrl: 'app/views/pages/spells/all.html',
                controller: 'spellController',
                controllerAs: 'spell'
            })

            //Form to create a new creature, same view as edit page
            .when('/spells/create', {
                templateUrl: 'app/views/pages/spells/single.html',
                controller: 'spellCreateController',
                controllerAs: 'spell'
            })

            // page to edit a creature
            .when('/spells/:spell_id', {
                templateUrl: 'app/views/pages/spells/single.html',
                controller: 'spellEditController',
                controllerAs: 'spell'
            })
            
            //Page to Handle Character Creation and Getting and Updating
            .when('/game/:user_id', {
                templateUrl: 'app/views/pages/game.html',
                controller: 'gamePlayController',
                controllerAs: 'game'
            })
            
           ////Page to handle the players inventory
           // .when('/game/inventory/:char_id', {
           // templateUrl: 'app/views/pages/game.html',
           // controller: 'gameInventoryController',
           // contollerAs: 'game'
           // })

           // //Page to handle the players quests.
           // .when('/game/quest/:char_id', {
           //     templateUrl: 'app/views/pages/game.html',
           //     controller: 'gameQuestController',
           //     contollerAs: 'game'
           // });
        
        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    }); 