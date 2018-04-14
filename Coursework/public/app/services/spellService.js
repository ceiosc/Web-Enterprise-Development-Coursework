angular.module('spellService', [])
    .factory('Spell', function ($http) {

        // create a new object
        var spellFactory = {};

        // get a single spell
        spellFactory.get = function (id) {
            return $http.get('/api/spells/' + id);
        };

        // get all spells
        spellFactory.all = function () {
            return $http.get('/api/spells/');
        };

        // create an spell
        spellFactory.create = function (spellData) {
            return $http.post('/api/spells/', spellData);
        };

        // update an spell
        spellFactory.update = function (id, spellData) {
            return $http.put('/api/spells/' + id, spellData);
        };

        // delete an spell
        spellFactory.delete = function (id) {
            return $http.delete('/api/spells/' + id);
        };

        // return our entire spellFactory object
        return spellFactory;
    }); 