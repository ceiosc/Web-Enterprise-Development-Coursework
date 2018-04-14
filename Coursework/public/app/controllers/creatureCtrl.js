angular.module('creatureCtrl', ['creatureService'])

    // creature controller for the main page
    // inject the creature factory
    .controller('creatureController', function (Creature) {

        var vm = this;

        // set a processing variable to show loading things 
        vm.processing = true;

        // grab all the creatures at page load
        Creature.all()
            .success(function (data) {
                // when all the creatures come back, remove the processing variable
                vm.processing = false;
                // bind the creatures that come back to vm.creatures
                vm.creatures = data;
            });

        // function to delete an creature
        vm.deleteCreature = function (id) {
            vm.processing = true;

            // accepts the creature id as a parameter
            Creature.delete(id)
                .success(function (data) {

                    // get all creatures to update the table
                    // you can also set up your api
                    // to return the list of creatures with the delete call
                    Creature.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.creatures = data;
                        });
                });
        };

    })

    // controller applied to creature creation page
    .controller('creatureCreateController', function (Creature) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create an creature
        vm.saveCreature = function () {
            vm.processing = true;

            // clear the message
            vm.message = '';

            // use the create function in the creatureService
            Creature.create(vm.creatureData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form
                    vm.creatureData = {};
                    vm.message = data.message;
                });
        };
    })

    // controller applied to creature edit page
    .controller('creatureEditController', function ($routeParams, Creature) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the creature data for the creature you want to edit
        // $routeParams is the way we grab data from the URL 
        Creature.get($routeParams.creature_id)
            .success(function (data) {
                vm.creatureData = data;
            });

        // function to save the creature
        vm.saveCreature = function () {
            vm.processing = true;
            vm.message = '';

            // call the creatureService function to update
            Creature.update($routeParams.creature_id, vm.creatureData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form 
                    vm.creatureData = {};
                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };
    }); 