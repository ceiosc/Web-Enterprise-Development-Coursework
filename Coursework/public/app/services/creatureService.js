angular.module('creatureService', [])
    .factory('Creature', function ($http) {

        // create a new object
        var creatureFactory = {};

        // get a single creature
        creatureFactory.get = function (id) {
            return $http.get('/api/creatures/' + id);
        };

        // get all creatures
        creatureFactory.all = function () {
            return $http.get('/api/creatures/');
        };

        // create a creature
        creatureFactory.create = function (creatureData) {
            return $http.post('/api/creatures/', creatureData);
        };

        // update a creatures
        creatureFactory.update = function (id, creatureData) {
            return $http.put('/api/creatures/' + id, creatureData);
        };

        // delete a creature
        creatureFactory.delete = function (id) {
            return $http.delete('/api/creatures/' + id);
        };

        // return our entire creatureFactory object
        return creatureFactory;
    }); 