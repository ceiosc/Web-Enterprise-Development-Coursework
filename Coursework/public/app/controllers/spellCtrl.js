angular.module('spellCtrl', ['spellService'])

    // spell controller for the main page
    // inject the Spell factory
    .controller('spellController', function (Spell) {

        var vm = this;

        // set a processing variable to show loading things 
        vm.processing = true;

        // grab all the spells at page load
        Spell.all()
            .success(function (data) {
                // when all the spells come back, remove the processing variable
                vm.processing = false;
                // bind the spells that come back to vm.spells
                vm.spells = data;
            });

        // function to delete an spell
        vm.deleteSpell = function (id) {
            vm.processing = true;

            // accepts the spell id as a parameter
            Spell.delete(id)
                .success(function (data) {

                    // get all spells to update the table
                    // you can also set up your api
                    // to return the list of spells with the delete call
                    Spell.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.spells = data;
                        });
                });
        };

    })

    // controller applied to spell creation page
    .controller('spellCreateController', function (Spell) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create an spell
        vm.saveSpell = function () {
            vm.processing = true;

            // clear the message
            vm.message = '';

            // use the create function in the spellService
            Spell.create(vm.spellData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form
                    vm.spellData = {};
                    vm.message = data.message;
                });
        };
    })

    // controller applied to spell edit page
    .controller('spellEditController', function ($routeParams, Spell) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the spell data for the spell you want to edit
        // $routeParams is the way we grab data from the URL 
        Spell.get($routeParams.spell_id)
            .success(function (data) {
                vm.spellData = data;
            });

        // function to save the spell
        vm.saveSpell = function () {
            vm.processing = true;
            vm.message = '';

            // call the spellService function to update
            Spell.update($routeParams.spell_id, vm.spellData)
                .success(function (data) {
                    vm.processing = false;
                    // clear the form 
                    vm.spellData = {};
                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };
    }); 