angular.module('encounterCtrl', ['encounterService'])

    // encounter controller for the main page
    // inject the Encounter factory
    .controller('encounterController', function(Encounter, Creature) {

        var vm = this;

        // set a processing variable to show loading things 
        vm.processing = true;

        //Get and setup creature/encounter information on page load
        vm.setupEncounters = function () {
            // grab all the creatures at page load
            Creature.all()
                .success(function (data) {
                    // when all the creatures come back, remove the processing variable
                    vm.processing = false;
                    // bind the creatures that come back to vm.creatures
                    vm.creatures = data;
                });

            // grab all the encounters at page load
            Encounter.all()
                .success(function (encounterData) {
                    // when all the encounters come back, remove the processing variable
                    vm.processing = false;
                    vm.encounters = []
					
                    for (var i = 0; i < encounterData.length; i++) {
                        var firstCreature;
                        var secondCreature;
                        var thirdCreature;

                        for (var j = 0; j < vm.creatures.length; j++) {
                            if (vm.creatures[j]._id == encounterData[i].firstCreature) {
                                firstCreature = vm.creatures[j];
                            }
                            if (vm.creatures[j]._id == encounterData[i].secondCreature) {
                                secondCreature = vm.creatures[j];
                            }
                            if (vm.creatures[j]._id == encounterData[i].thirdCreature) {
                                thirdCreature = vm.creatures[j];
                            }
                        }

                    // bind the encounters that come back to vm.encounters
                        vm.encounters.push({
                            id: encounterData[i]._id,
                            firstCreature: firstCreature,
                            secondCreature: secondCreature,
                            thirdCreature: thirdCreature,
                            experience: encounterData[i].experience,
                            minimumLevel: encounterData[i].minimumLevel,
                            maximumLevel: encounterData[i].maximumLevel
                        });
                    }
                    
                });
        }    

        // function to delete an encounter
        vm.deleteEncounter = function(id) {
            vm.processing = true;

            // accepts the encounter id as a parameter
            Encounter.delete(id)
                .success(function(data) {

                    // get all encounters to update the table
                    // you can also set up your api
                    // to return the list of encounters with the delete call
                    Encounter.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.encounters = data;
                        });
                });
        };

    })

    // controller applied to encounter creation page
    .controller('encounterCreateController', function($location, Encounter, Creature) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // grab all the creatures at page load
        Creature.all()
            .success(function (data) {
                // when all the creatures come back, remove the processing variable
                vm.processing = false;
                // bind the creatures that come back to vm.creatures
                vm.creatures = data;
            });

        // function to create an encounter
        vm.saveEncounter = function() {
            vm.processing = true;
            vm.newEncounter = null;

            vm.newEncounter = {
                firstCreature: vm.encounterData.firstCreature._id ,
                secondCreature: vm.encounterData.secondCreature._id ,
                thirdCreature: vm.encounterData.thirdCreature._id ,
                experience: vm.encounterData.experience,
                minimumLevel: vm.encounterData.minimumLevel,
                maximumLevel: vm.encounterData.maximumLevel
            };

            // clear the message
            vm.message = '';

            // use the create function in the encounterService
            Encounter.create(vm.newEncounter)
                .success(function(data) {
                    vm.processing = false;
                    // clear the form
                    vm.encounterData = {};
                    vm.newEncounter = {};
                    vm.message = data.message;
                    $location.path('/encounters');
                });
        };
    })

    // controller applied to encounter edit page
    .controller('encounterEditController', function($routeParams, $location, Encounter, Creature) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';
        vm.encounterData;
        // grab all the creatures at page load
        Creature.all()
            .success(function (data) {
                // when all the items come back, remove the processing variable
                vm.processing = false;
                // bind the items that come back to vm.items
                vm.creatures = data;
            });

        // get the encounter data for the encounter you want to edit
        // $routeParams is the way we grab data from the URL 
        Encounter.get($routeParams.encounter_id)
            .success(function(data) {
                vm.retrievedData = data;
                var firstCreature;
                var secondCreature;
                var thirdCreature;

                for (var i = 0; i < vm.creatures.length; i++) {
                    if (vm.creatures[i]._id == vm.retrievedData.firstCreature) {
                        firstCreature = vm.creatures[i];
                    }
                    if (vm.creatures[i]._id == vm.retrievedData.secondCreature) {
                        secondCreature = vm.creatures[i];
                    }
                    if (vm.creatures[i]._id == vm.retrievedData.thirdCreature) {
                        thirdCreature = vm.creatures[i];
                    }
                }


                vm.encounterData = {
                    firstCreature: firstCreature,
                    secondCreature: secondCreature,
                    thirdCreature: thirdCreature,
                    experience: vm.retrievedData.experience,
                    minimumLevel: vm.retrievedData.minimumLevel,
                    maximumLevel: vm.retrievedData.maximumLevel
                };
                
            });

        // function to save the encounter - CANNOT FIND ENCOUNTERDATA (UNDEFINED?)
        vm.saveEncounter = function() {
            vm.processing = true;
            vm.message = '';
			
            // call the encounterService function to update
            Encounter.update($routeParams.encounter_id, vm.encounterData)
                .success(function(data) {
                    vm.processing = false;
                    // clear the form 
                    vm.encounterData = {};
                    // bind the message from our API to vm.message
                    vm.message = data.message;
                    $location.path('/encounters');
                });
        };
    }); 