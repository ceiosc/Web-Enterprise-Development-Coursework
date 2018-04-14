angular.module('gameCtrl', ['gameService'])

    // user controller for the main page
    // inject the Game factory
    
    .controller('gamePlayController', function ($routeParams, User, Game) {

        var vm = this;
        vm.processing = true;
        //Character which will store
        vm.character;

        //Menu 1 Visibility Settings
        vm.play = true;
        vm.stats = false;
        vm.invent = false;
        vm.quests = false;
        vm.tutorial = false;

        //Menu 2 Visibility Settings
        vm.explore = false;
        vm.shop = false;
        vm.create = false;
        vm.village = false;
        
        console.log("Line Above Game.getChar method");
        //Get character on page load
        Game.getChar($routeParams.user_id)
            .success(function (data) {

                //if a chracter was not returned
                vm.processing = false;
                console.log("Data before if statement");
                console.log(data);
                if (data == null) {

                    //create a character
                    Game.createChar(vm.userid)
                        .success(function (data) {
                            console.log("Creating Character");

                            //Get the character created
                            Game.getChar(vm.userid)
                                .success(function (data) {
                                    console.log("Retrieving Character2");
                                    //Assign character data to vm.character
                                    vm.character = data;
                                    console.log("Data assigned to Character: " + vm.character)
                                });
                        });
                }
                //Otherwise, character returned
                else {
                    console.log("Retrieving Character");
                    //Assign character data to vm.character
                    vm.processing = false;
                    vm.character = data;
                    vm.setupCharacter();
                }
            });     
            

        //NOT WORKING, LOOK AT USER TO FIGURE OUT
        vm.setupCharacter = function () {
            vm.character.health = 10 * vm.character.constitution;
            vm.character.damage = 1 + vm.character.strength;
            vm.character.dodge = 5 + vm.character.dexterity;
            vm.character.magicDamage = (0.5 * vm.character.intelligence);
        };

        //Shows the Game tab, hides the others.
        vm.showGame = function () {
            vm.play = true;
            vm.stats = false;
            vm.invent = false;
            vm.quests = false;
            vm.tutorial = false;
        }

        //Shows the Character tab, hides the others.
        vm.showStats = function () {
            vm.play = false;
            vm.stats = true;
            vm.invent = false;
            vm.quests = false;
            vm.tutorial = false;
        };

        //Shows the Inventory tab, hides the others.
        vm.showInv = function () {
            vm.play = false;
            vm.stats = false;
            vm.invent = true;
            vm.quests = false;
            vm.tutorial = false;
        };

        //Shows the Quests tab, hides the others.
        vm.showQuests = function () {
            vm.play = false;
            vm.stats = false;
            vm.invent = false;
            vm.quests = true;
            vm.tutorial = false;
        };

        //Shows the Tutorial tab, hides the others.
        vm.showTutorial = function () {
            vm.play = false;
            vm.stats = false;
            vm.invent = false;
            vm.quests = false;
            vm.tutorial = true;
        };

        //Shows the Explore the World tab, hides the others.
        vm.Explore = function () {
            vm.explore = true;
            vm.shop = false;
            vm.create = false;
            vm.village = false;
        }

        //Shows the Buy Items tab, hides the others.
        vm.Shop = function () {
            vm.explore = false;
            vm.shop = true;
            vm.create = false;
            vm.village = false;
        }

        //Shows the Visit Blacksmith tab, hides the others.
        vm.Create = function () {
            vm.explore = false;
            vm.shop = false;
            vm.create = true;
            vm.village = false;
        }

        //Shows the Go into the village tab, hides the others.
        vm.Village = function () {
            vm.explore = false;
            vm.shop = false;
            vm.create = false;
            vm.village = true;
        }

        //vm.updateChar

        //vm.getInv

        //vm.addInv

        //vm.addQuest
    });