angular.module('itemCtrl', ['itemService'])

    // item controller for the main page
    // inject the Item factory
    .controller('itemController', function (Item) {

        var vm = this;

        // set a processing variable to show loading things 
        vm.processing = true;

        // grab all the items at page load
        Item.all()
            .success(function (data) {
                // when all the items come back, remove the processing variable
                vm.processing = false;
                // bind the items that come back to vm.items
                vm.items = data;
            });

        // function to delete an item
        vm.deleteItem = function (id) {
            vm.processing = true;

            // accepts the item id as a parameter
            Item.delete(id)
                .success(function (data) {

                    // get all items to update the table
                    // you can also set up your api
                    // to return the list of items with the delete call
                    Item.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.items = data;
                        });
                });
        };

    })

    // controller applied to item creation page
    .controller('itemCreateController', function (Item) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create an item
        vm.saveItem = function () {
            vm.processing = true;

            // clear the message
            vm.message = '';

            // use the create function in the itemService
            Item.create(vm.itemData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form
                    vm.itemData = {};
                    vm.message = data.message;
                });
        };
    })

    // controller applied to item edit page
    .controller('itemEditController', function ($routeParams, Item) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the item data for the item you want to edit
        // $routeParams is the way we grab data from the URL 
        Item.get($routeParams.item_id)
            .success(function (data) {
                vm.itemData = data;
            });

        // function to save the item
        vm.saveItem = function () {
            vm.processing = true;
            vm.message = '';

            // call the itemService function to update
            Item.update($routeParams.item_id, vm.itemData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form 
                    vm.itemData = {};
                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };
    }); 