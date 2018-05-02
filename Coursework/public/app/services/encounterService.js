angular.module('encounterService', [])
    .factory('Encounter', function($http) {

        // create a new object
        var encounterFactory = {};

        // get a single encounter
        encounterFactory.get = function(id) {
            return $http.get('/api/encounters/' + id);
        };

        // get all encounters
        encounterFactory.all = function() {
            return $http.get('/api/encounters/');
        };

        // get appropriate encounter given player level
        encounterFactory.getEncounter = function(level) {
            return $http.get('/api/encounters/level/' + level)
        }

        // create an encounter
        encounterFactory.create = function (encounterData) {
            return $http.post('/api/encounters/', encounterData);
        };

        // update an encounter
        encounterFactory.update = function (id, encounterData) {
            return $http.put('/api/encounters/' + id, encounterData);
        };

        // delete an encounter
        encounterFactory.delete = function(id) {
            return $http.delete('/api/encounters/' + id);
        };

        // return our entire itemFactory object
        return encounterFactory;
    }); 