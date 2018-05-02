angular.module('inventService', [])
    .factory('Inventory', function ($http) {

        // create a new object
        var inventoryFactory = {};

        // get all item's in a character's inventory
        inventoryFactory.get = function (charId) {
            return $http.get('/api/inventory/' + charId);
        };
        
        // add an item to inventory
        inventoryFactory.add = function (itemData) {
            return $http.put('/api/inventory/add/', itemData);
        };

        // remove an item from the inventory
        inventoryFactory.remove = function (itemData) {
            return $http.put('/api/inventory/remove/', itemData);
        };

        // delete an item from inventory (should only be done when item reaches 0 quantity)
        inventoryFactory.delete = function (charId, itemData) {
            return $http.delete('/api/inventory/' + charId + '/' + itemData);
        };

        // return our entire inventoryFactory object
        return inventoryFactory;
    }); 