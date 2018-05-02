angular.module('app.routes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            //////////////////////////////////////////////////////////
            //******************Main Controller***********************
            //////////////////////////////////////////////////////////

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

            //////////////////////////////////////////////////////////
            //******************User Controller***********************
            //////////////////////////////////////////////////////////

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

            //////////////////////////////////////////////////////////
            //******************Item Controller***********************
            //////////////////////////////////////////////////////////

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

            //////////////////////////////////////////////////////////
            //****************Creature Controller*********************
            //////////////////////////////////////////////////////////

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

            //////////////////////////////////////////////////////////
            //*****************Spell Controller***********************
            //////////////////////////////////////////////////////////

            //Form to create a new spell, same view as edit page
            .when('/spells', {
                templateUrl: 'app/views/pages/spells/all.html',
                controller: 'spellController',
                controllerAs: 'spell'
            })

            //Form to create a new spell, same view as edit page
            .when('/spells/create', {
                templateUrl: 'app/views/pages/spells/single.html',
                controller: 'spellCreateController',
                controllerAs: 'spell'
            })

            // page to edit a spell
            .when('/spells/:spell_id', {
                templateUrl: 'app/views/pages/spells/single.html',
                controller: 'spellEditController',
                controllerAs: 'spell'
            })

            //////////////////////////////////////////////////////////
            //*******************Npc Controller***********************
            //////////////////////////////////////////////////////////

            //Form to create a new npc, same view as edit page
            .when('/npcs', {
                templateUrl: 'app/views/pages/npcs/all.html',
                controller: 'npcController',
                controllerAs: 'npc'
            })

            //Form to create a new npc, same view as edit page
            .when('/npcs/create', {
                templateUrl: 'app/views/pages/npcs/single.html',
                controller: 'npcCreateController',
                controllerAs: 'npc'
            })

            // page to edit an npc
            .when('/npcs/:npc_id', {
                templateUrl: 'app/views/pages/npcs/single.html',
                controller: 'npcEditController',
                controllerAs: 'npc'
            })

            //////////////////////////////////////////////////////////
            //******************Shop Controller***********************
            //////////////////////////////////////////////////////////

            //Form view all item's sold by shops
            .when('/shops', {
                templateUrl: 'app/views/pages/shops/all.html',
                controller: 'shopController',
                controllerAs: 'shop'
            })

            //Form to create a new npc, same view as edit page
            .when('/shops/create', {
                templateUrl: 'app/views/pages/shops/single.html',
                controller: 'shopCreateController',
                controllerAs: 'shop'
            })

            //Page to view the stock for a single shop
            .when('/shops/:shop_owner', {
                templateUrl: 'app/views/pages/shops/single.html',
                controller: 'shopSinglecontroller',
                controllerAs: 'shop'
            })

            //////////////////////////////////////////////////////////
            //****************Encounter Controller********************
            //////////////////////////////////////////////////////////

            //Form to create a new item, same view as edit page
            .when('/encounters', {
                templateUrl: 'app/views/pages/encounters/all.html',
                controller: 'encounterController',
                controllerAs: 'encounter'
            })

            //Form to create a new item, same view as edit page
            .when('/encounters/create', {
                templateUrl: 'app/views/pages/encounters/single.html',
                controller: 'encounterCreateController',
                controllerAs: 'encounter'
            })

            // page to edit an item
            .when('/encounters/:encounter_id', {
                templateUrl: 'app/views/pages/encounters/single.html',
                controller: 'encounterEditController',
                controllerAs: 'encounter'
            })


            //////////////////////////////////////////////////////////
            //******************Game Controller***********************
            //////////////////////////////////////////////////////////
            
            //Page to Handle Character Creation and Getting and Updating
            .when('/game/:user_id', {
                templateUrl: 'app/views/pages/game/game.html',
                controller: 'gamePlayController',
                controllerAs: 'game'
            })          
           
        
        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    }); 