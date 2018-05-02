angular.module('userApp', [
    'ngAnimate',
    'app.routes',
    'mainCtrl',
    'userCtrl',
    'gameCtrl',
    'itemCtrl',
    'creatureCtrl',
    'spellCtrl',
    'npcCtrl',
    'shopCtrl',
    'encounterCtrl',
    'authService',
    'userService',
    'gameService',
    'itemService',
    'creatureService',
    'spellService',
    'npcService',
    'shopService',
    'inventService',
    'levelService',
    'encounterService'
])
    // application configuration to integrate token into requests
    .config(function ($httpProvider) {
        // attach our auth interceptor to the http requests 
        $httpProvider.interceptors.push('AuthInterceptor');
    });

