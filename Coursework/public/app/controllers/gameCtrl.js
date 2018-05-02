angular.module('gameCtrl', ['gameService'])

    // user controller for the main page
    // inject the Game factory

    .controller('gamePlayController', function ($routeParams, $location, $window, User, Game, Npc, Shop, Item, Inventory, Level, Spell, Encounter, Creature) {

        var vm = this;
        vm.processing = true;
        //Character which will store
        vm.character;

        //Set fight variable to empty
        vm.fight = {};
        vm.fight.player = {};
        vm.fight.encounter = {};
        vm.fight.information = "";

        //Initialise all the character details, Fetch them if a character exists
        vm.getCharacterDetails = function () {
            vm.character = null;
            //Get character on page load
            Game.getChar($routeParams.user_id)
                .success(function (data1) {
                    
                    //if a chracter was not returned
                    vm.processing = false;
                    if (data1 == null) {
                        //create a character
                        Game.createChar($routeParams.user_id)
                            .success(function (data2) {       
                                //Get the character created
                                Game.getChar($routeParams.user_id)
                                    .success(function (data3) {
                                        //Assign character data to vm.character
                                        vm.character = data3;

                                        //Sword Item Data
                                        var sword = {
                                            characterID: data3._id,
                                            itemID: "5ae9dfa8734d1d70892b896f",
                                            quantity: 1
                                        };

                                        //Shield Item Data
                                        var shield = {
                                            characterID: data3._id,
                                            itemID: "5ae9dfb2734d1d70892b8975",
                                            quantity: 1
                                        }

                                        //Chest Item Data
                                        var chest = {
                                            characterID: data3._id,
                                            itemID: "5ae9dfc0734d1d70892b898e",
                                            quantity: 1
                                        }

                                        //Legs Item Data
                                        var legs = {
                                            characterID: data3._id,
                                            itemID: "5ae9dfc6734d1d70892b89c6",
                                            quantity: 1
                                        }

                                        //Boots Item Data
                                        var boots = {
                                            characterID: data3._id,
                                            itemID: "5ae9dfcc734d1d70892b89cc",
                                            quantity: 1
                                        }

                                        //Sword Item Data
                                        var head = {
                                            characterID: data3._id,
                                            itemID: "5ae9dfb9734d1d70892b8978",
                                            quantity: 1
                                        }

                                        Inventory.add(sword).success(function (data) { });
                                        Inventory.add(shield).success(function (data) { });
                                        Inventory.add(chest).success(function (data) { });
                                        Inventory.add(legs).success(function (data) { });
                                        Inventory.add(boots).success(function (data) { });
                                        Inventory.add(head).success(function (data) { });


                                        vm.setupCharacter();
                                        vm.getInventory();
										vm.wait(10000);
                                        $window.location.reload();
                                        
                                    });
                            });
                    }
                    //Otherwise, character returned
                    else {
                        //Assign character data to vm.character
                        vm.processing = false;
                        vm.character = data1;
                        vm.setupCharacter();
                        vm.getInventory();
                    }
                });
        }

        //Get all character's for the leaderboard
        vm.getLeaderboard = function () {
            vm.leaderboardRankings = null;
            vm.leaderboardRankings = [];
            Game.all()
                .success(function (charData) {
                    //Loop through each character returned and find the player that matches to get player name
                    for (var i = 0; i < charData.length; i++) {
                        User.get(charData[i].userID)
                            .success(function (userData) {
                                vm.leaderboardRankings.push({
                                    name: userData.username,
                                    level: charData[vm.leaderboardRankings.length].level,
                                    constitution: charData[vm.leaderboardRankings.length].baseConstitution,
                                    strength: charData[vm.leaderboardRankings.length].baseStrength,
                                    dexterity: charData[vm.leaderboardRankings.length].baseDexterity,
                                    intelligence: charData[vm.leaderboardRankings.length].baseIntelligence,
                                    experience: charData[vm.leaderboardRankings.length].experience
                                });
                            });
                    };                   
                });
        }        

        //Get the character's inventory
        vm.getInventory = function () {
            vm.inventory = null;
            vm.inventory = [];
            Inventory.get(vm.character._id)
                .success(function (invData) {
                    for (var i = 0; i < invData.length; i++) {
                        Item.get(invData[i].itemID)
                            .success(function (itemData) {
                                vm.inventory.push({
                                    itemID: itemData._id,
                                    health: itemData.health,
                                    intelligence: itemData.intelligence,
                                    dexterity: itemData.dexterity,
                                    strength: itemData.strength,
                                    constitution: itemData.constitution,
                                    slot: itemData.slot,
                                    itemDescription: itemData.description,
                                    type: itemData.type,
                                    itemName: itemData.name,
                                    sellPrice: itemData.sellPrice,
                                    quantity: invData[vm.inventory.length].quantity,
                                    equipped: vm.checkEquipped(itemData._id)
                                });
                            });
                    };


                });

            vm.getEquipmentData();
        };

        //Method to fetch the item data for each of the equipped items and store it in an equipment variable
        vm.getEquipmentData = function () {
            vm.equipment = null;
            vm.equipment = [];
            if (vm.character.head) {
                Item.get(vm.character.head)
                    .success(function (data) {
                        vm.equipment.head = data;
                    });
            }
            if (vm.character.chest) {
                Item.get(vm.character.chest)
                    .success(function (data) {
                        vm.equipment.chest = data;
                    });
            }
            if (vm.character.legs) {
                Item.get(vm.character.legs)
                    .success(function (data) {
                        vm.equipment.legs = data;
                    });
            }
            if (vm.character.boots) {
                Item.get(vm.character.boots)
                    .success(function (data) {
                        vm.equipment.boots = data;
                    });
            }
            if (vm.character.mainhand) {
                Item.get(vm.character.mainhand)
                    .success(function (data) {
                        vm.equipment.mainhand = data;
                    });
            }
            if (vm.character.offhand) {
                Item.get(vm.character.offhand)
                    .success(function (data) {
                        vm.equipment.offhand = data;
                    });
            }
            if (vm.character.ring) {
                Item.get(vm.character.ring)
                    .success(function (data) {
                        vm.equipment.ring = data;
                    });
            }
            if (vm.character.amulet) {
                Item.get(vm.character.amulet)
                    .success(function (data) {
                        vm.equipment.amulet = data;
                    });
            }
        };

        //Code to check if item id is equipped
        vm.checkEquipped = function (itemID) {
            if (vm.character.head) {
                if (vm.character.head == itemID) {
                    return true;
                }
            }
            if (vm.character.chest) {
                if (vm.character.chest == itemID) {
                    return true;
                }
            }
            if (vm.character.legs) {
                if (vm.character.legs == itemID) {
                    return true;
                }
            }
            if (vm.character.boots) {
                if (vm.character.boots == itemID) {
                    return true;
                }
            }
            if (vm.character.mainhand) {
                if (vm.character.mainhand == itemID) {
                    return true;
                }
            }
            if (vm.character.offhand) {
                if (vm.character.offhand == itemID) {
                    return true;
                }
            }
            if (vm.character.ring) {
                if (vm.character.ring == itemID) {
                    return true;
                }
            }
            if (vm.character.amulet) {
                if (vm.character.amulet == itemID) {
                    return true;
                }
            }
            return false;
        }

        //Code to equip an item
        vm.equip = function (item) {
            if (item.type == 'Equipment') {

                var characterData;

                if (item.slot == 'Head') {
                    if (vm.character.head) {
                        vm.unequip(vm.character.equipment.head, false);
                    }
                    vm.character.head = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        head: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                } 
                if (item.slot == 'Chest') {
                    vm.character.chest = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        chest: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }  
                if (item.slot == 'Legs') {
                    vm.character.legs = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        legs: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }  
                if (item.slot == 'Boots') {
                    vm.character.boots = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        boots: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }  
                if (item.slot == 'Mainhand') {
                    if (vm.character.mainhand) {
                        vm.unequip(vm.equipment.mainhand);
                    }
                    vm.character.mainhand = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        mainhand: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }  
                if (item.slot == 'Offhand') {
                    vm.character.offhand = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        offhand: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }  
                if (item.slot == 'Ring') {
                    vm.character.ring = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        ring: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }  
                if (item.slot == 'Amulet') {
                    vm.character.amulet = item.itemID;
                    vm.character.bonusStrength = vm.character.bonusStrength + item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity + item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution + item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence + item.intelligence;

                    characterData = {
                        amulet: item.itemID,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }  
                Game.updateChar(vm.character._id, characterData)
                    .success(function (data) {
                        vm.message = "Item Equipped"
                            
                    });
            };
            vm.getInventory();
        };

        vm.unequip = function (item, runInventCheck) {
            if (item.type == 'Equipment') {

                var characterData;
                if (item.slot == 'Head') {
                    vm.character.head = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        head: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }
                if (item.slot == 'Chest') {
                    vm.character.chest = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        chest: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }
                if (item.slot == 'Legs') {
                    vm.character.legs = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        legs: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }
                if (item.slot == 'Boots') {
                    vm.character.boots = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        boots: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }
                if (item.slot == 'Mainhand') {
                    vm.character.mainhand = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        mainhand: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence,
                    }
                }
                if (item.slot == 'Offhand') {
                    vm.character.offhand = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        offhand: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }
                if (item.slot == 'Ring') {
                    vm.character.ring = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        ring: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }
                if (item.slot == 'Amulet') {
                    vm.character.amulet = null;
                    vm.character.bonusStrength = vm.character.bonusStrength - item.strength;
                    vm.character.bonusDexterity = vm.character.bonusDexterity - item.dexterity;
                    vm.character.bonusConstitution = vm.character.bonusConstitution - item.constitution;
                    vm.character.bonusIntelligence = vm.character.bonusIntelligence - item.intelligence;

                    characterData = {
                        amulet: 0,
                        bonusStrength: vm.character.bonusStrength,
                        bonusDexterity: vm.character.bonusDexterity,
                        bonusConstitution: vm.character.bonusConstitution,
                        bonusIntelligence: vm.character.bonusIntelligence
                    }
                }
                
                Game.updateChar(vm.character._id, characterData)
                    .success(function (data) {
                        vm.message = "Item Un-equipped"

                    });
            };
            //Don't run invent check when called from equip method as this will be done at the end of the equip method
            if (runInventCheck) {
                vm.getInventory();
            }
        };

        //Populate the village with npcs to interact with
        vm.populateVillage = function () {
            Npc.all()
                .success(function (data) {
                    var index = 0;
                    var arrayLength = data.length;
                    var tempArray = [];
                    for (index = 0; index < arrayLength; index += 3) {
                        row = data.slice(index, index + 3);
                        tempArray.push(row);
                    }
                   vm.villagers = tempArray;
                });
        };

        //Code to display options when talking to a villager
        vm.talkTo = function (villager) {
            vm.selectNpc = false;
            vm.interactNpc = true;
            vm.shopStock = null;
            vm.sellInv = null;
            vm.message = null;
            vm.selectedVillager = villager
            vm.selectedVillager.speech = villager.welcome;
            vm.villagerOptions = [];
            vm.villagerOptions.push("Talk");

            if (villager.shopOwner) {
                vm.villagerOptions.push("Buy");
                vm.villagerOptions.push("Sell");
            }
        };

        //Code to buy an item
        vm.buyItem = function (item) {
            if (item.price <= vm.character.gold) {
                var newItem = {
                    characterID: vm.character._id,
                    itemID: item.item,
                    quantity: 1
                };

                var newCharData = {
                    gold: vm.character.gold - item.price
                };

                Game.updateChar(vm.character._id, newCharData)
                    .success(function (data) {
                        Inventory.add(newItem)
                            .success(function (data) {
                            });
                    });
					
				vm.wait(5000);	
                vm.message = "Item Bought";
                vm.getCharacterDetails();

            } else {
                vm.message = "Cannot Afford Item";
            }
        };

        //Code to sell an item
        vm.sellItem = function (item) {
            var newItem = {
                characterID: vm.character._id,
                itemID: item.itemID,
                quantity: item.quantity - 1
            };
            
            var newCharData = {
                gold: vm.character.gold + item.sellPrice
            };
            
            Game.updateChar(vm.character._id, newCharData)
                .success(function (data) {
                    if (newItem.quantity > 0) {
                        Inventory.remove(newItem)
                            .success(function (data) {

                            });
                    } else {
                        Inventory.delete(newItem.characterID, newItem.itemID)
                            .success(function (data) {
                            });
                    }

                    vm.message = "Item Sold";
                    vm.getCharacterDetails();
                });
        }

        //Code to display information when selecting options buy, talk and sell while speaking to a villager
        vm.selectOption = function (villager, option) {
            if (option == "Talk") {
                vm.selectedVillager.speech = villager.thank;
            };
            if (option == "Buy") {
                vm.shopStock = null;
                vm.shopStock = [];
                vm.getCharacterDetails();
				vm.allItems = null;
				vm.allItems = [];				
						
				Item.all()
					.success(function(data){
						vm.allItems = data;
					});
				
				
                Shop.get(villager.name)
                    .success(function (shopData) {
                        // when all the shops come back, remove the processing variable
                        vm.processing = false;

						// when all the shops come back, remove the processing variable
                        vm.processing = false;	

						vm.shopStock = shopData;					

                        for (var i = 0; i < shopData.length; i++) {
                            for(var j = 0; j < vm.allItems.length; j++){
								if (vm.allItems[j]._id == shopData[i].item){
									vm.shopStock[i].description = vm.allItems[j].description;
									vm.shopStock[i].name = vm.allItems[j].name;
								}
							}
                        };
                    });
                vm.sellInv = null;
            };
            if (option == "Sell") {
                Shop.get(villager.name)
                    .success(function (data) {
                        vm.sellInv = vm.inventory;
                    });
                vm.shopStock = null;
            };
        }

        //Code to reset variables after un-selecting a villager
        vm.unselectVillager = function () {
            vm.selectNpc = true;
            vm.interactNpc = false;
            vm.selectedVillager = null;
            vm.villagerOptions = null;
            vm.message = null;
        };

        //Code to reset variables after leaving a shop
        vm.leaveShop = function () {
            vm.shopStock = null;
            vm.sellInv = null;
            vm.message = null;
        }

        //Code to level up a stat and decrease level up points
        vm.levelStat = function (statName) {
            var newCharData;
            if (statName == 'Constitution') {
                vm.character.baseConstitution = vm.character.baseConstitution + 1;
                vm.character.levelUpPoints = vm.character.levelUpPoints - 1;

                newCharData = {
                    baseConstitution: vm.character.baseConstitution,
                    levelUpPoints: vm.character.levelUpPoints
                }
            }
            if (statName == 'Strength') {
                vm.character.baseStrength = vm.character.baseStrength + 1;
                vm.character.levelUpPoints = vm.character.levelUpPoints - 1;

                newCharData = {
                    baseStrength: vm.character.baseStrength,
                    levelUpPoints: vm.character.levelUpPoints
                }
            }
            if (statName == 'Dexterity') {
                vm.character.baseDexterity = vm.character.baseDexterity + 1;
                vm.character.levelUpPoints = vm.character.levelUpPoints - 1;

                newCharData = {
                    baseDexterity: vm.character.baseDexterity,
                    levelUpPoints: vm.character.levelUpPoints
                }
            }
            if (statName == 'Intelligence') {
                vm.character.baseIntelligence = vm.character.baseIntelligence + 1;
                vm.character.levelUpPoints = vm.character.levelUpPoints - 1;

                newCharData = {
                    baseIntelligence: vm.character.baseIntelligence,
                    levelUpPoints: vm.character.levelUpPoints
                }
            }

            Game.updateChar(vm.character._id, newCharData)
                .success(function (data) {
                    vm.message = "Levelled Up: " + statName;
                    vm.getCharacterDetails();
                });

        };


        //Calculate other character attributes from character's stats
        vm.setupCharacter = function () {
            vm.character.health = Math.max((10 * (vm.character.baseConstitution + vm.character.bonusConstitution)), 10);
            vm.character.damage = Math.max((1 + (vm.character.baseStrength + vm.character.bonusStrength)),1);
            vm.character.dodge = Math.max((5 + (vm.character.baseDexterity + vm.character.bonusDexterity)),0);
            vm.character.magicDamage = Math.max(Math.floor((1+ 0.5 * (vm.character.baseIntelligence + vm.character.bonusIntelligence))),1);
            vm.character.mana = 4 * (vm.character.baseIntelligence + vm.character.bonusIntelligence);
            vm.character.nextLevel = 0;

            Level.getExperience(vm.character.level + 1)
                .success(function (data) {
                    vm.character.nextLevel = data[0].experience;
                });
        };

        //Select a Spell to be used in battle
        vm.selectSpell = function () {
            vm.fight.castableSpells = null;
            Spell.getSpells(vm.character.baseIntelligence + vm.character.bonusIntelligence)
                .success(function (data) {
                    vm.fight.castableSpells = data;
                })
        }

        //Select an Item to be used in battle
        vm.selectItem = function () {
            vm.fight.useableItems = null;
            Inventory.get(vm.character._id)
                .success(function (inventData) {

                    vm.fight.useableItems = []
                    for (var i = 0; i < inventData.length; i++) {
                        var itemQuantity = inventData[i].quantity;
                        if (itemQuantity > 0) {
                            Item.get(inventData[i].itemID)
                                .success(function (itemData) {
                                    if (itemData.type == 'Consumable') {
                                        itemData.quantity = itemQuantity;
                                        vm.fight.useableItems.push(itemData);
                                    }
                                }); 
                        };
                                               
                    };
                    

            })
        }

        /////////////////////////////////////////////////////////////////////////
        //**************************VM Methods for Fights************************
        /////////////////////////////////////////////////////////////////////////

        //Initialise parameters for battle start
        vm.initialiseBattle = function() {

            vm.fight.fightFinished = false;

            //Setup variables inside vm.fight, create new instances of parameters as they could change mid-fight.
            vm.fight.player.MaxHealth = vm.character.health;
            vm.fight.player.MaxMana = vm.character.mana;

            vm.fight.player.CurHealth = vm.character.health;
            vm.fight.player.CurMana = vm.character.mana;

            vm.fight.player.HealthBar = (vm.fight.player.CurHealth / vm.fight.player.MaxHealth) * 100;
            vm.fight.player.ManaBar = (vm.fight.player.CurMana / vm.fight.player.MaxMana) * 100;

            vm.fight.player.damage = vm.character.damage;
            vm.fight.player.dodge = vm.character.dodge;
            vm.fight.player.magicDamage = vm.character.magicDamage;

            
            vm.fight.itemCooldown = false;

            vm.fight.spell = null;

            //Generate random encounter
            vm.fight.enemy1 = {};
            vm.fight.enemy2 = {};
            vm.fight.enemy3 = {};

            //Generate random encounters
            Encounter.getEncounter(vm.character.level)
                .success(function(data) {
                    var randomNumber = (Math.floor(Math.random() * data.length));
                    vm.fight.encounter = data[randomNumber];

                    //Get Creature Data for all creatures
                    vm.creatures = {};
                    Creature.all()
                        .success(function(data) {
                            // when all the creatures come back, remove the processing variable
                            vm.processing = false;
                            // bind the creatures that come back to vm.creatures
                            vm.creatures = data; 
                            //Loop through creature data, match to id and assign to enemy variables
                            for (var i = 0; i < vm.creatures.length; i++) {
                                if (vm.creatures[i]._id == vm.fight.encounter.firstCreature) {
                                    vm.fight.enemy1 = vm.creatures[i];
                                    vm.fight.enemy1.targetName = 'enemy1';
                                }
                                if (vm.creatures[i]._id == vm.fight.encounter.secondCreature) {
                                    vm.fight.enemy2 = vm.creatures[i];
                                    vm.fight.enemy1.targetName = 'enemy2';
                                }
                                if (vm.creatures[i]._id == vm.fight.encounter.thirdCreature) {
                                    vm.fight.enemy3 = vm.creatures[i];
                                    vm.fight.enemy1.targetName = 'enemy3';
                                }
                            }

                            //Set up enemy 1 battle stats                            
                            vm.fight.enemy1.damage = 1 + vm.fight.enemy1.strength;
                            vm.fight.enemy1.dodge = 5 + vm.fight.enemy1.dexterity;
                            vm.fight.enemy1.magicDamage = Math.max((0.5 * vm.fight.enemy1.intelligence), 1);

                            vm.fight.enemy1.MaxHealth = 10 * vm.fight.enemy1.constitution;
                            vm.fight.enemy1.CurHealth = vm.fight.enemy1.MaxHealth;
                            vm.fight.enemy1.HealthBar = (vm.fight.enemy1.CurHealth / vm.fight.enemy1.MaxHealth) * 100;

                            vm.fight.enemy1.MaxMana = vm.fight.enemy1.magicDamage + 1;
                            vm.fight.enemy1.CurMana = vm.fight.enemy1.MaxMana;
                            vm.fight.enemy1.ManaBar = (vm.fight.enemy1.CurMana / vm.fight.enemy1.MaxMana) * 100;
                            
                            //Set up enemy 2 battle stats
                            vm.fight.enemy2.damage = 1 + vm.fight.enemy2.strength;
                            vm.fight.enemy2.dodge = 5 + vm.fight.enemy2.dexterity;
                            vm.fight.enemy2.magicDamage = Math.max((0.5 * vm.fight.enemy2.intelligence), 1);

                            vm.fight.enemy2.MaxHealth = 10 * vm.fight.enemy2.constitution;
                            vm.fight.enemy2.CurHealth = vm.fight.enemy2.MaxHealth;
                            vm.fight.enemy2.HealthBar = (vm.fight.enemy2.CurHealth / vm.fight.enemy2.MaxHealth) * 100;

                            vm.fight.enemy2.MaxMana = vm.fight.enemy2.magicDamage + 1;
                            vm.fight.enemy2.CurMana = vm.fight.enemy2.MaxMana;
                            vm.fight.enemy2.ManaBar = (vm.fight.enemy2.CurMana / vm.fight.enemy2.MaxMana) * 100;

                            //Set up enemy 3 battle stats
                            vm.fight.enemy3.damage = 1 + vm.fight.enemy3.strength;
                            vm.fight.enemy3.dodge = 5 + vm.fight.enemy3.dexterity;
                            vm.fight.enemy3.magicDamage = Math.max((0.5 * vm.fight.enemy3.intelligence), 1);

                            vm.fight.enemy3.MaxHealth = 10 * vm.fight.enemy3.constitution;
                            vm.fight.enemy3.CurHealth = vm.fight.enemy3.MaxHealth;
                            vm.fight.enemy3.HealthBar = (vm.fight.enemy3.CurHealth / vm.fight.enemy3.MaxHealth) * 100;

                            vm.fight.enemy3.MaxMana = vm.fight.enemy3.magicDamage + 1;
                            vm.fight.enemy3.CurMana = vm.fight.enemy3.MaxMana;
                            vm.fight.enemy3.ManaBar = (vm.fight.enemy3.CurMana / vm.fight.enemy3.MaxMana) * 100;

                            vm.fight.turnCount = 1;
                            vm.updateTextArea("Turn: " + vm.fight.turnCount);
                        });            

                });


        }

        vm.updateHealthMana = function() {
            vm.fight.player.HealthBar = (vm.fight.player.CurHealth / vm.fight.player.MaxHealth) * 100;
            vm.fight.player.ManaBar = (vm.fight.player.CurMana / vm.fight.player.MaxMana) * 100;

            vm.fight.enemy1.HealthBar = (vm.fight.enemy1.CurHealth / vm.fight.enemy1.MaxHealth) * 100;
            vm.fight.enemy1.ManaBar = (vm.fight.enemy1.CurMana / vm.fight.enemy1.MaxMana) * 100;

            vm.fight.enemy2.HealthBar = (vm.fight.enemy2.CurHealth / vm.fight.enemy2.MaxHealth) * 100;
            vm.fight.enemy2.ManaBar = (vm.fight.enemy2.CurMana / vm.fight.enemy2.MaxMana) * 100;

            vm.fight.enemy3.HealthBar = (vm.fight.enemy3.CurHealth / vm.fight.enemy3.MaxHealth) * 100;
            vm.fight.enemy3.ManaBar = (vm.fight.enemy3.CurMana / vm.fight.enemy3.MaxMana) * 100;
        }

        //Method to attack a monster
        vm.attackTarget = function(enemy, attackType) {
            if (attackType == 'Attack'){
                //Roll random number to determine if attack hits
                var attackToHit = (Math.floor(Math.random() * 100));
                var hit = true;
                //If number < dodge chance, attack was dodged.
                if (attackToHit < enemy.dodge) {
                    hit = false;
                } else {
                    if (enemy == 'enemy1') {
                        vm.updateTextArea("You attacked: " + vm.fight.enemy1.name);
                        vm.fight.enemy1.CurHealth = Math.max(vm.fight.enemy1.CurHealth - vm.fight.player.damage, 0);
                        if (vm.fight.enemy1.CurHealth == 0) {
                            vm.fight.enemy1.CurMana = 0;
                        }
                    } else if (enemy == 'enemy2') {
                        vm.updateTextArea("You attacked: " + vm.fight.enemy2.name);
                        vm.fight.enemy2.CurHealth = Math.max(vm.fight.enemy2.CurHealth - vm.fight.player.damage, 0);
                        if (vm.fight.enemy2.CurHealth == 0) {
                            vm.fight.enemy2.CurMana = 0;
                        }
                    } else {
                        vm.updateTextArea("You attacked: " + vm.fight.enemy3.name);
                        vm.fight.enemy3.CurHealth = Math.max(vm.fight.enemy3.CurHealth - vm.fight.player.damage, 0);
                        if (vm.fight.enemy3.CurHealth == 0) {
                            vm.fight.enemy3.CurMana = 0;
                        }
                    }
                    vm.updateTextArea("You dealt " + vm.fight.player.damage + " damage!");
                }
                if (!hit) {
                    vm.updateTextArea("The attack missed!");
                }
            } else {
                if (vm.checkCost(vm.fight.spell.cost)) {
                    vm.castSpell(enemy);
                } else {
                    alert("You do not have enough Magic Points!");
                    return false;
                }
            } 
            vm.fight.itemCooldown = false;

            if (vm.fight.enemy1.CurHealth > 0 || vm.fight.enemy2.CurHealth > 0 || vm.fight.enemy3.CurHealth > 0) {
                //Do monster things
                vm.updateHealthMana();
                setTimeout(vm.creatureAttacks(), 1000);                
                vm.updateHealthMana();
            } else {
                vm.updateHealthMana();
                vm.fightWon();
            }
            
        }

        //Method to use an item
        vm.useItem = function (target) {
            vm.updateTextArea("You used " + vm.fight.item.name + ", you healed " + vm.fight.item.health + " hitpoints!");
            vm.fight.player.CurHealth = Math.min(vm.fight.player.CurHealth + vm.fight.item.health, vm.fight.player.MaxHealth);
            

            var newItemData = {
                characterID: vm.character._id,
                itemID: vm.fight.item._id,
                quantity: vm.fight.item.quantity -1
            }

            if (newItemData.quantity > 0) {
                Inventory.remove(newItemData)
                    .success(function (data) {
                        vm.fight.useableItems = null;
                    });
            } else {
                Inventory.delete(newItemData.characterID, newItemData.itemID)
                    .success(function (data) {
                        vm.fight.useableItems = null;
                    });
            }

            

            vm.fight.itemCooldown = true;
            if (vm.fight.enemy1.CurHealth > 0 || vm.fight.enemy2.CurHealth > 0 || vm.fight.enemy3.CurHealth > 0) {
                //Do monster things
                vm.updateHealthMana();
                setTimeout(vm.creatureAttacks(), 1000);
                vm.updateHealthMana();
            } else {
                vm.updateHealthMana();
                vm.fightWon();
            }
        }

        //Method to check if spell can be cost (magic points available). Disables options in ng-options if it can't
        vm.checkCost = function(cost) {
            if (cost <= vm.fight.player.CurMana) {
                return true;
            } else {
                return false;
            }
        }

        //Method to use an item in battle
        vm.castSpell = function(target) {          
            if (vm.fight.spell.type == 'Damage') {
                if (target == 'enemy1') {
                    vm.updateTextArea("You cast " + vm.fight.spell.name + " at: " + vm.fight.enemy1.name);
                    vm.fight.enemy1.CurHealth = Math.max(vm.fight.enemy1.CurHealth - (vm.fight.spell.damage + vm.character.magicDamage), 0);
                    if (vm.fight.enemy1.CurHealth == 0) {
                        vm.fight.enemy1.CurMana = 0;
                    }
                } else if (target == 'enemy2') {
                    vm.updateTextArea("You cast " + vm.fight.spell.name + " at: " + vm.fight.enemy2.name);
                    vm.fight.enemy2.CurHealth = Math.max(vm.fight.enemy2.CurHealth - (vm.fight.spell.damage + vm.character.magicDamage), 0);
                    if (vm.fight.enemy2.CurHealth == 0) {
                        vm.fight.enemy2.CurMana = 0;
                    }
                } else if (target =='enemy3') {
                    vm.updateTextArea("You cast " + vm.fight.spell.name + " at: " + vm.fight.enemy3.name);
                    vm.fight.enemy3.CurHealth = Math.max(vm.fight.enemy3.CurHealth - (vm.fight.spell.damage + vm.character.magicDamage), 0);
                    if (vm.fight.enemy3.CurHealth == 0) {
                        vm.fight.enemy3.CurMana = 0;
                    }
                } else {
                    alert("You did not select a valid target!");
                }
                vm.updateTextArea("You dealt " + (vm.fight.spell.damage + vm.character.magicDamage) + " damage!");
                vm.fight.player.CurMana = vm.fight.player.CurMana - vm.fight.spell.cost;
            } else if (vm.fight.spell.type == 'Healing') {
                vm.updateTextArea("You cast " + vm.fight.spell.name + ", you healed " + vm.fight.spell.health + " hitpoints!");
                vm.fight.player.CurHealth = Math.min(vm.fight.player.CurHealth + vm.fight.spell.health, vm.fight.player.MaxHealth);
                vm.fight.player.CurMana = vm.fight.player.CurMana - vm.fight.spell.cost;
            } else if (vm.fight.spell.tyle == 'Buff') {
                //Not implemented yet
            }
        }

        //Method to run away from a battle
        vm.RunAway = function() {
            vm.explore = false;
            vm.fight = null;
            vm.selectedTab = null;
            vm.fight = {};
            vm.fight.player = {};
            vm.fight.encounter = {};
            vm.fight.information = "";
        }

        //Method to make the creatures attack the player
        vm.creatureAttacks = function() {

            //If enemy1 is still alive
            if (vm.fight.enemy1.CurHealth > 0 && vm.fight.player.CurHealth > 0) {
                vm.fight.turn == 'Enemy1';
                vm.updateTextArea(vm.fight.enemy1.name + " attacked!");

                //Roll random number to determine if attack hits
                var attackToHit = (Math.floor(Math.random() * 100));

                //If number < dodge chance, attack was dodged.
                if (attackToHit < vm.fight.player.dodge) {
                    vm.updateTextArea("The attack missed!");
                } else {
                    vm.updateTextArea("You took " + vm.fight.enemy1.damage + " damage!");
                    vm.fight.player.CurHealth = vm.fight.player.CurHealth - vm.fight.enemy1.damage;
                }
            }

            //If enemy2 is still alive
            if (vm.fight.enemy2.CurHealth > 0 && vm.fight.player.CurHealth > 0) {
                vm.fight.turn == 'Enemy2';
                vm.updateTextArea(vm.fight.enemy2.name + " attacked!");

                //Roll random number to determine if attack hits
                var attackToHit = (Math.floor(Math.random() * 100));

                //If number < dodge chance, attack was dodged.
                if (attackToHit < vm.fight.player.dodge) {
                    vm.updateTextArea("The attack missed!");
                } else {
                    vm.updateTextArea("You took " + vm.fight.enemy2.damage + " damage!");
                    vm.fight.player.CurHealth = vm.fight.player.CurHealth - vm.fight.enemy2.damage;
                }
            }

            //If enemy3 is still alive
            if (vm.fight.enemy3.CurHealth > 0 && vm.fight.player.CurHealth > 0) {
                vm.fight.turn == 'Enemy3';
                vm.updateTextArea(vm.fight.enemy3.name + " attacked!");

                //Roll random number to determine if attack hits
                var attackToHit = (Math.floor(Math.random() * 100));

                //If number < dodge chance, attack was dodged.
                if (attackToHit < vm.fight.player.dodge) {
                    vm.updateTextArea("The attack missed!");
                } else {
                    vm.updateTextArea("You took " + vm.fight.enemy3.damage + " damage!");
                    vm.fight.player.CurHealth = vm.fight.player.CurHealth - vm.fight.enemy3.damage;
                }
            }

            if (vm.fight.player.CurHealth <= 0) {
                vm.fightLost();
            } else {
                vm.fight.turnCount = vm.fight.turnCount + 1;
                vm.updateTextArea("Turn: " + vm.fight.turnCount);
            }
            vm.scrollBottom();
        }

        //Method if the battle has been won, rewards the player
        vm.fightWon = function() {
            //Flag fight finished as a win
            vm.fightFinished = true;
            vm.fight.result = 'Won';

            vm.fight.rewards = {}

            //Award gold and experience
            vm.fight.rewards.gold = Math.floor(Math.random() * (vm.character.level + 10) + 1);
            vm.fight.rewards.exp = vm.fight.encounter.experience;

            vm.character.experience = vm.character.experience + vm.fight.rewards.exp;
            vm.character.gold = vm.character.gold + vm.fight.rewards.gold;
            vm.fight.rewards.levelup = null;
            vm.fight.rewards.levelPoints = null;

            //calculate if level up
            if (vm.character.experience >= vm.character.nextLevel) {
                vm.fight.rewards.levelup = true;
                vm.character.level = vm.character.level + 1;
                if (vm.character.level % 5 == 0) {
                    vm.character.levelUpPoints = vm.character.levelUpPoints + 5;
                    vm.fight.rewards.levelPoints = 5;
                } else {
                    vm.character.levelUpPoints = vm.character.levelUpPoints + 2;
                    vm.fight.rewards.levelPoints = 2;
                }
            } else {
                vm.fight.rewards.levelup = false;
            }       

            Game.updateChar(vm.character._id, vm.character)
                .success(function(data) {
                    console.log("Character Saved after Winning Fight");
                });
            
        }

        //Method if the battle has been lost, penalises the player
        vm.fightLost = function() {
            //Flag fight finished as a loss
            vm.fightFinished = true;
            vm.fight.result = 'Lost';

            vm.fight.rewards = {};

            //Deduct gold from character
            vm.fight.rewards.gold = Math.floor(vm.character.gold * 0.1); 
            vm.character.gold = vm.character.gold - vm.fight.rewards.gold;

            Game.updateChar(vm.character._id, vm.character)
                .success(function(data) {
                    console.log("Character Saved after Losing Fight");
                });
            
        }

        //Method to force the game to wait, useful to stop all monsters from attacking
        //Simultaneously and overwhelming the user with information.
        vm.wait = function(milliseconds) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + milliseconds) {
                end = new Date().getTime();
            }
        }

        //Method to finish the fight and reset all variables
        vm.finishFight = function() {
            vm.fightFinished = false;
            vm.explore = false;

            //Set fight variable to empty
            vm.fight = {};
            vm.fight.player = {};
            vm.fight.encounter = {};
            vm.fight.information = "";
            vm.getCharacterDetails();
        }

        //Method to write to the text area by updating the information variable
        vm.updateTextArea = function(message) {
            vm.fight.information = vm.fight.information + message + '\n';
            vm.scrollBottom();
        }

        //Method to scroll to bottom of textarea
        vm.scrollBottom = function () {
            var textarea = document.getElementById('txtAreaInformation');
            textarea.scrollTop = textarea.scrollHeight;
        }

        /////////////////////////////////////////////////////////////////////////
        //**********************Visibility Settings for Tabs*********************
        /////////////////////////////////////////////////////////////////////////

        //Menu 1 Visibility Settings
        vm.play = true;
        vm.stats = false;
        vm.invent = false;
        vm.leaderboard = false;
        vm.tutorial = false;

        //Menu 2 Visibility Settings
        vm.explore = false;
        vm.village = false;

        //Sets all the menu 1 visibility options to false
        vm.hideAllFirstMenu = function() {
            vm.play = false;
            vm.stats = false;
            vm.invent = false;
            vm.leaderboard = false;
            vm.tutorial = false;
        };

        //Sets all the menu 2 visibility options to false
        vm.hideAllGameMenu = function() {
            vm.explore = false;
            vm.village = false;
            vm.selectNpc = false;
            vm.interactNpc = false;
        };

        //Shows the Game tab, hides the others.
        vm.showGame = function () {
            vm.hideAllFirstMenu();
            vm.play = true;
            vm.message = "";
        };

        //Shows the Character tab, hides the others.
        vm.showStats = function () {
            vm.hideAllFirstMenu();
            vm.stats = true;
            vm.message = "";
        };

        //Shows the Inventory tab, hides the others.
        vm.showInv = function () {
            vm.hideAllFirstMenu();
            vm.getInventory();
            vm.invent = true;
            vm.message = "";
        };

        //Shows the Quests tab, hides the others.
        vm.showLeaderboard = function () {
            vm.hideAllFirstMenu();
            vm.leaderboard = true;
            vm.getLeaderboard();
        };

        //Shows the Tutorial tab, hides the others.
        vm.showTutorial = function () {
            vm.hideAllFirstMenu();
            vm.tutorial = true;
        };

        //Shows the Explore the World tab, hides the others.
        vm.Explore = function () {
            vm.hideAllGameMenu();
            vm.explore = true;
            vm.initialiseBattle();
        }
        
        //Shows the Go into the village tab, hides the others. Removes the explore/go into village buttons and shows a leave village button
        vm.Village = function () {          
            vm.hideAllGameMenu();
            vm.village = true;
            vm.selectNpc = true;
            vm.populateVillage();
        }
    });