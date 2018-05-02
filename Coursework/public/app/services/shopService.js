angular.module('shopService', [])
    .factory('Shop', function ($http) {

        // create a new object
        var shopFactory = {};

        // Get the stock for a single shop owner
        shopFactory.get = function (id) {
            return $http.get('/api/shops/' + id);
        };

        // Get all items sold by all shops
        shopFactory.all = function () {
            return $http.get('/api/shops/');
        };

        // Add an item to a shops stock
        shopFactory.create = function (shopData) {
            return $http.post('/api/shops/', shopData);
        };
        
        // Delete an item from a shops stock
        shopFactory.delete = function (id) {
            return $http.delete('/api/shops/' + id);
        };

        // return our entire shopFactory object
        return shopFactory;
    }); 