angular.module('gameService', [])

    .factory('Game', function ($http) {
        // create a new object
        var gameFactory = {};

        //Get character
        gameFactory.getChar = function (userId) {
            return $http.get('/api/game/' + userId);
        };

        // get all characters
        gameFactory.all = function () {
            return $http.get('/api/game/');
        };

        //Create Character
        gameFactory.createChar = function (userId) {
            return $http.post('/api/game/' + userId);
        };

        //Update Character
        gameFactory.updateChar = function (userId, characterData) {
            return $http.put('/api/game/' + userId, characterData)
        };

        //Get equipped items
        gameFactory.getInv = function (charId) {
            return $http.get('/api/game/equipped', charId);
        };
        
        //Start Quest
        gameFactory.addQuest = function (charId, questId) {
            return $http.post('/api/game/quest', charId, questId)
        };
        // return our entire gameFactory object
        return gameFactory;
    }); 