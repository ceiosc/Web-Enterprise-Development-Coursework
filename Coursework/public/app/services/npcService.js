angular.module('npcService', [])
    .factory('Npc', function ($http) {

        // create a new object
        var npcFactory = {};

        // get a single npc
        npcFactory.get = function (id) {
            return $http.get('/api/npcs/' + id);
        };

        // get all npcs
        npcFactory.all = function () {
            return $http.get('/api/npcs/');
        };

        //get all npcs who are shop owners
        npcFactory.owners = function () {
            return $http.get('api/npcs/shopOwners');
        }

        // create an npc
        npcFactory.create = function (npcData) {
            return $http.post('/api/npcs/', npcData);
        };

        // update an npc
        npcFactory.update = function (id, npcData) {
            return $http.put('/api/npcs/' + id, npcData);
        };

        // delete an npc
        npcFactory.delete = function (id) {
            return $http.delete('/api/npcs/' + id);
        };

        // return our entire npcFactory object
        return npcFactory;
    }); 