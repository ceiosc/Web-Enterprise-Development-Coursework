angular.module('shopCtrl', ['shopService'])

    // shop controller for the main page
    // inject the Shop factory
    .controller('shopController', function (Shop, Item, Npc) {

        var vm = this;

        // set a processing variable to show loading things 
        vm.processing = true;
                
        vm.shops = null;
        Shop.all()
            .success(function (shopData) {
                // when all the shops come back, remove the processing variable
                vm.processing = false;
                vm.shops = [];
                for (var i = 0; i < shopData.length; i++) {
                    Item.get(shopData[i].item)
                        .success(function (itemData) {
                            vm.shops.push({
                                shopID: shopData[vm.shops.length]._id,
                                shopOwner: shopData[vm.shops.length].shopOwner,
                                item: itemData.name,
                                price: shopData[vm.shops.length].price,
                                description: itemData.description
                            });
                        });
                };
            });
       
          
        

        // function to delete an item from a shop
        vm.deleteItem = function (id) {
            vm.processing = true;
            // accepts the shop id as a parameter
            
            Shop.delete(id)
                .success(function (data) {
                    vm.processing = false;
                    vm.shops = [];
                    // get all shops to update the table
                    // you can also set up your api
                    // to return the list of shops with the delete call
                    Shop.all()
                        .success(function (shopData) {
                            // when all the shops come back, remove the processing variable
                            vm.processing = false;

                            for (var i = 0; i < shopData.length; i++) {
                                Item.get(shopData[i].item)
                                    .success(function (itemData) {
                                        vm.shops.push({
                                            shopID: shopData[vm.shops.length]._id,
                                            shopOwner: shopData[vm.shops.length].shopOwner,
                                            item: itemData.name,
                                            price: shopData[vm.shops.length].price,
                                            description: itemData.description
                                        });
                                    });
                            };
                        });
                });
        };

    })

    // controller applied to shop creation page
    .controller('shopCreateController', function (Shop, Item, Npc) {
        var vm = this;
        
        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // grab all the items at page load
        Item.all()
            .success(function (data) {
                // when all the items come back, remove the processing variable
                vm.processing = false;
                // bind the items that come back to vm.items
                vm.items = data;
            });

        // grab all the npcs who are shop owners at page load
        Npc.owners()
            .success(function (data) {
                // when all the npcs come back, remove the processing variable
                vm.processing = false;
                // bind the npcs that come back to vm.npcs
                vm.npcs = data;
            });

        // function to create a shop
        vm.saveShop = function () {
            vm.processing = true;
            vm.shopData.item = vm.shopData.item._id;
            // clear the message
            vm.message = '';
            // use the create function in the shopService
            Shop.create(vm.shopData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form
                    vm.shopData = {};
                    vm.message = data.message;
                });
        };
    })

    // controller applied to shop edit page
    .controller('shopSinglecontroller', function ($routeParams, Shop) {
        var vm = this;

        // get the shop data a single shop
        // $routeParams is the way we grab data from the URL 
        Shop.get($routeParams.shop_owner)
            .success(function (data) {
                vm.shopData = data;
            });

    });