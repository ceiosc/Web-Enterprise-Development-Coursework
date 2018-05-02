angular.module('levelService', [])
    .factory('Level', function ($http) {

        // create a new object
        var levelFactory = {};

        // get level object, given level
        levelFactory.getExperience = function (level) {
            return $http.get('/api/level/' + level);
        };

        // return our entire inventoryFactory object
        return levelFactory;
    }); 