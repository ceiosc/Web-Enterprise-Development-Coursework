angular.module('npcCtrl', ['npcService'])

    // npc controller for the main page
    // inject the Npc factory
    .controller('npcController', function (Npc) {

        var vm = this;

        // set a processing variable to show loading things 
        vm.processing = true;

        // grab all the npcs at page load
        Npc.all()
            .success(function (data) {
                // when all the npcs come back, remove the processing variable
                vm.processing = false;
                // bind the npcs that come back to vm.npcs
                vm.npcs = data;
            });

        // function to delete an npc
        vm.deleteNpc = function (id) {
            vm.processing = true;

            // accepts the npc id as a parameter
            Npc.delete(id)
                .success(function (data) {

                    // get all npcs to update the table
                    // you can also set up your api
                    // to return the list of npcs with the delete call
                    Npc.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.npcs = data;
                        });
                });
        };

    })

    // controller applied to npc creation page
    .controller('npcCreateController', function (Npc) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create an npc
        vm.saveNpc = function () {
            vm.processing = true;

            // clear the message
            vm.message = '';

            // use the create function in the npcService
            Npc.create(vm.npcData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form
                    vm.npcData = {};
                    vm.message = data.message;
                });
        };
    })

    // controller applied to npc edit page
    .controller('npcEditController', function ($routeParams, Npc) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the npc data for the npc you want to edit
        // $routeParams is the way we grab data from the URL 
        Npc.get($routeParams.npc_id)
            .success(function (data) {
                vm.npcData = data;
            });

        // function to save the npc
        vm.saveNpc = function () {
            vm.processing = true;
            vm.message = '';

            // call the npcService function to update
            Npc.update($routeParams.npc_id, vm.npcData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form 
                    vm.npcData = {};
                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };
    });