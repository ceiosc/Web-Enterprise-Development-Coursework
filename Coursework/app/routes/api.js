var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
var Character = require('../models/character');
var Item = require('../models/item');
var Creature = require('../models/creature');
var Spell = require('../models/spell');
var Npc = require('../models/npc');
var Shop = require('../models/shop');
var Inventory = require('../models/inventory');
var Level = require('../models/level');
var Encounter = require('../models/encounter');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {

    var apiRouter = express.Router();

    //*** CODE TO GENERATE FIRST ENCOUNTER ITEM IN A TABLE, ONLY USED DURING DEVELOPMENT***
    //route to generate sample npc 
    apiRouter.post('/sample', function (req, res) {

        // look for the item called wooden sword
        Encounter.findOne({
            'firstCreature': '5ad20f37acb50a982684c6de',
            'secondCreature': '5ad20f37acb50a982684c6de',
            'thirdCreature': '5ad20f37acb50a982684c6de'
        }, function (err, encounter) {

            // if there is no item being sold with the id matching wooden sword
            if (!encounter) {
                var sampleEncounter = new Encounter();

                sampleEncounter.firstCreature = '5ad20f37acb50a982684c6de';
                sampleEncounter.secondCreature = '5ad20f37acb50a982684c6de';
                sampleEncounter.thirdCreature = '5ad20f37acb50a982684c6de';
                sampleEncounter.experience = 50;
                sampleEncounter.minimumLevel = 1;
                sampleEncounter.maximumLevel = 5;

                sampleEncounter.save();
            } else {

                // if there is a wooden sword in the shop, set it's price to 10'
                inventory.itemName = 'Wooden Sword';
                inventory.save();
            }

        });

    });

    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')
        // create a user (accessed at POST http://localhost:8080/users)
        .post(function (req, res) {

            var user = new User(); // create a new instance of the User model
            user.name = req.body.name; // set the users name (comes from the request)
            user.username = req.body.username; // set the users username (comes from the request)
            user.password = req.body.password; // set the users password (comes from the request)
            user.role = 'Player'; //Set the users access level (comes from the request)

            user.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({
                            success: false,
                            message: 'A user with that username already exists. '
                        });
                    else
                        return res.send(err);
                }

                // return a message
                res.json({
                    message: 'User created!'
                });
            });

        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function (req, res) {

            User.find({}, function (err, users) {
                if (err) res.send(err);

                // return the users
                res.json(users);
            });
        });

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function (req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }).select('_id name username password role').exec(function (err, user) {

            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        role: user.role
                    }, superSecret, {
                            expiresIn: '24h' // expires in 24 hours
                        });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });

    // route middleware to verify a token
    apiRouter.use(function (req, res, next) {
        // do logging
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {

                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next(); // make sure we go to the next routes and don't stop here
                }
            });

        } else {

            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    // test route to make sure everything is working
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function (req, res) {
        res.json({
            message: 'hooray! welcome to our api!'
        });
    });

    

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

        // get the user with that id
        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        // update the user with this id
        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {

                if (err) res.send(err);

                // set the new user information if it exists in the request
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;
                if (req.body.role) user.role = req.body.role;

                // save the user
                user.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'User updated!'
                    });
                });

            });
        })

        // delete the user with this id
        .delete(function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err) res.send(err);

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////*************GAME*************//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    apiRouter.route('/game')

    // get all the characters (accessed at GET http://localhost:8080/api/game)
        .get(function (req, res) {

        Character.find({}, function (err, characters) {
            if (err) res.send(err);

            // return the characters
            res.json(characters);
        });
    });

    apiRouter.route('/game/:user_id')
        .get(function (req, res) {
            Character.findOne({
                'userID': req.params.user_id
            }, function (err, character) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(character);
                };
            })
        })

        .post(function (req, res) {
            var char = new Character(); // create a new instance of the Character model
            char.userID = req.params.user_id; // set the userID (comes from request parameters)
            char.level = 1;
            char.levelUpPoints = 0;
            char.experience = 0;
            char.gold = 50;

            //Set base stats
            char.baseConstitution = 1;
            char.baseStrength = 1;
            char.baseDexterity = 1;
            char.baseIntelligence = 1;

            //Set bonus stats from gear assigned below
            char.bonusConstitution = 2;
            char.bonusStrength = 1;
            char.bonusDexterity = 5;
            char.bonusIntelligence = 0;

            //Equip starting gear to character
            char.mainhand = "5ae9dfa8734d1d70892b896f"; // Wooden Sword
            char.offhand = "5ae9dfb2734d1d70892b8975"; //Wooden Shield
            char.chest = "5ae9dfc0734d1d70892b898e"; //Leather Shirt
            char.legs = "5ae9dfc6734d1d70892b89c6"; //Leather Chaps
            char.boots = "5ae9dfcc734d1d70892b89cc"; //Leather Boots
            char.head = "5ae9dfb9734d1d70892b8978"; //Leather Cap
            char.ring = null;
            char.amulet = null;
            
            char.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({
                            success: false,
                            message: 'This user already has a character'
                        });
                    else
                        return res.send(err);
                }

                // return a message
                res.json({
                    message: 'Character created!'
                });
            });
        })
        
        .put(function (req, res) {
            Character.findById(req.params.user_id, function (err, character) {
                if (err) {
                    res.send(err);
                }

                // set the new character information if it exists in the request
                if (req.body.level) {
                    character.level = req.body.level;
                }
                if (req.body.levelUpPoints || req.body.levelUpPoints === 0) {
                    character.levelUpPoints = req.body.levelUpPoints;
                }
                if (req.body.baseConstitution) {
                    character.baseConstitution = req.body.baseConstitution;
                }
                if (req.body.baseStrength) {
                    character.baseStrength = req.body.baseStrength;
                }
                if (req.body.baseDexterity) {
                    character.baseDexterity = req.body.baseDexterity;
                }
                if (req.body.baseIntelligence) {
                    character.baseIntelligence = req.body.baseIntelligence;
                }
                if (req.body.bonusStrength || req.body.bonusStrength === 0 ) {
                    character.bonusStrength = req.body.bonusStrength;
                }
                if (req.body.bonusDexterity || req.body.bonusDexterity === 0) {
                    character.bonusDexterity = req.body.bonusDexterity;
                }
                if (req.body.bonusConstitution || req.body.bonusConstitution === 0) {
                    character.bonusConstitution = req.body.bonusConstitution;
                }
                if (req.body.bonusIntelligence || req.body.bonusIntelligence === 0) {
                    character.bonusIntelligence = req.body.bonusIntelligence;
                }
                if (req.body.experience) {
                    character.experience = req.body.experience;
                }
                if (req.body.gold) {
                    character.gold = req.body.gold;
                }
                if (req.body.head) {
                    character.head = req.body.head;
                } else if (req.body.head == 0) {
                    character.head = null
                }
                if (req.body.chest) {
                    character.chest = req.body.chest;
                } else if (req.body.chest == 0) {
                    character.chest = null
                }
                if (req.body.legs) {
                    character.legs = req.body.legs;
                } else if (req.body.legs == 0) {
                    character.legs = null
                }
                if (req.body.boots) {
                    character.boots = req.body.boots;
                } else if (req.body.boots == 0) {
                    character.boots = null
                }
                if (req.body.mainhand) {
                    character.mainhand = req.body.mainhand;
                } else if (req.body.mainhand == 0) {
                    character.mainhand = null
                }
                if (req.body.offhand) {
                    character.offhand = req.body.offhand;
                } else if (req.body.offhand == 0) {
                    character.offhand = null
                }
                if (req.body.ring) {
                    character.ring = req.body.ring;
                } else if (req.body.ring == 0) {
                    character.ring = null
                }
                if (req.body.amulet) {
                    character.amulet = req.body.amulet;
                } else if (req.body.amulet == 0) {
                    character.amulet = null
                }

                // save the user
                character.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    // return a message
                    res.json({
                        message: 'Character updated!'
                    });
                });
            });
        });   
    
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////************ITEMS*************//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    // on routes that end in /items
    // ----------------------------------------------------
    apiRouter.route('/items')
        // create an item (accessed at POST http://localhost:8080/items)
        .post(function (req, res) {

            var item = new Item(); // create a new instance of the Item model
            item.name = req.body.name; // set the item's name (comes from the request)
            item.type = req.body.type; // set the item's type (comes from the request)
            item.description = req.body.description; // set the item's description (comes from the request)
            item.sellPrice = req.body.sellPrice; // set the item's sell price (comes from the request)
            item.slot = req.body.slot; // set the item's slot (comes from the request)
            item.constitution = req.body.constitution; // set the item's constitution bonus (comes from the request)
            item.strength = req.body.strength; // set the item's strength bonus (comes from the request)
            item.dexterity = req.body.dexterity; // set the item's dexterity bonus (comes from the request)
            item.intelligence = req.body.intelligence; // set the item's intelligence bonus (comes from the request)
            item.health = req.body.health; // set the item's health bounus (comes from the request)

            item.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'An item with that name already exists. '
                        });
                    }
                    else {
                        return res.send(err);
                    }
                }

                // return a message
                res.json({
                    message: 'Item created!'
                });
            });

        })

        // get all the items (accessed at GET http://localhost:8080/api/items)
        .get(function (req, res) {

            Item.find({}, function (err, items) {
                if (err) res.send(err);

                // return the items
                res.json(items);
            });
        });

    // on routes that end in /items/:item_id
    // ----------------------------------------------------
    apiRouter.route('/items/:item_id')

        // get the item with that id
        .get(function (req, res) {
            Item.findById(req.params.item_id, function (err, item) {
                if (err) res.send(err);

                // return that item
                res.json(item);
            });
        })

        // update the item with this id
        .put(function (req, res) {
            Item.findById(req.params.item_id, function (err, item) {

                if (err) {
                    res.send(err);
                }

                // set the new item information if it exists in the request
                if (req.body.name) {
                    item.name = req.body.name;
                }
                if (req.body.type) {
                    item.type = req.body.type;
                }
                if (req.body.description) {
                    item.description = req.body.description;
                }
                if (req.body.sellPrice) {
                    item.sellPrice = req.body.sellPrice;
                }
                if (req.body.slot) {
                    item.slot = req.body.slot;
                }
                if (req.body.constitution) {
                    item.constitution = req.body.constitution;
                }
                if (req.body.strength) {
                    item.strength = req.body.strength;
                }
                if (req.body.dexterity) {
                    item.dexterity = req.body.dexterity;
                }
                if (req.body.intelligence) {
                    item.intelligence = req.body.intelligence;
                }
                if (req.body.health) {
                    item.health = req.body.health;
                }

                // save the item
                item.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'Item updated!'
                    });
                });

            });
        })

        // delete the item with this id
        .delete(function (req, res) {
            Item.remove({
                _id: req.params.item_id
            }, function (err, item) {
                if (err) res.send(err);

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////**********CREATURES***********//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    // on routes that end in /creatures
    // ----------------------------------------------------
    apiRouter.route('/creatures')
        // create an item (accessed at POST http://localhost:8080/creatures)
        .post(function (req, res) {

            var creature = new Creature(); // create a new instance of the Creature model
            creature.name = req.body.name; // set the creature's name (comes from the request)
            creature.description = req.body.description; // set the creature's description (comes from the request)
            creature.constitution = req.body.constitution; // set the creature's constitution (comes from the request)
            creature.strength = req.body.strength; // set the creature's strength (comes from the request)
            creature.dexterity = req.body.dexterity; // set the creature's dexterity (comes from the request)
            creature.intelligence = req.body.intelligence; // set the creature's intelligence (comes from the request)
            creature.growth = req.body.growth; // set the creature's growth rate (comes from the request)
            creature.difficulty = req.body.difficulty; // set the item's difficulty (comes from the request)

            creature.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'An creature with that name already exists. '
                        });
                    }
                    else {
                        return res.send(err);
                    }
                }

                // return a message
                res.json({
                    message: 'Creature created!'
                });
            });

        })

        // get all the creatures (accessed at GET http://localhost:8080/api/creatures)
        .get(function (req, res) {

            Creature.find({}, function (err, creatures) {
                if (err) res.send(err);

                // return the items
                res.json(creatures);
            });
        });

    // on routes that end in /creatures/:creature_id
    // ----------------------------------------------------
    apiRouter.route('/creatures/:creature_id')

        // get the creature with that id
        .get(function (req, res) {
            Creature.findById(req.params.creature_id, function (err, creature) {
                if (err) res.send(err);

                // return that creature
                res.json(creature);
            });
        })

        // update the creature with this id
        .put(function (req, res) {
            Creature.findById(req.params.creature_id, function (err, creature) {

                if (err) {
                    res.send(err);
                }

                // set the new creature information if it exists in the request
                if (req.body.name) {
                    creature.name = req.body.name;
                }
                if (req.body.description) {
                    creature.description = req.body.description;
                }
                if (req.body.constitution) {
                    creature.constitution = req.body.constitution;
                }
                if (req.body.strength) {
                    creature.strength = req.body.strength;
                }
                if (req.body.dexterity) {
                    creature.dexterity = req.body.dexterity;
                }
                if (req.body.intelligence) {
                    creature.intelligence = req.body.intelligence;
                }
                if (req.body.growth) {
                    creature.growth = req.body.growth;
                }
                if (req.body.difficulty) {
                    creature.difficulty = req.body.difficulty;
                }

                // save the creature
                creature.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'Creature updated!'
                    });
                });

            });
        })

        // delete the creature with this id
        .delete(function (req, res) {
            Creature.remove({
                _id: req.params.creature_id
            }, function (err, creature) {
                if (err) {
                    res.send(err);
                }

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////***********SPELLS*************//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    // on routes that end in /spells
    // ----------------------------------------------------
    apiRouter.route('/spells')
        // create an item (accessed at POST http://localhost:8080/spells)
        .post(function (req, res) {

            var spell = new Spell(); // create a new instance of the Spell model
            spell.name = req.body.name; // set the spell's name (comes from the request)
            spell.type = req.body.type; // set the spell's description (comes from the request)
            spell.cost = req.body.cost; // set the spell's cost (comes from the request)
            spell.level = req.body.level; // set the spell's level (comes from the request)
            spell.description = req.body.description; // set the spell's description (comes from the request)
            spell.constitution = req.body.constitution //set the spell's constitution effect (comes from the request)
            spell.strength = req.body.strength; // set the spell's strength effect  (comes from the request)
            spell.dexterity = req.body.dexterity; // set the spell's dexterity effect  (comes from the request)
            spell.intelligence = req.body.intelligence; // set the spell's intelligence  effect (comes from the request)
            spell.health = req.body.health; // set the spell's health effect  (comes from the request)
            spell.damage = req.body.damage; // set the spell's damage (comes from the request)

            spell.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'A spell with that name already exists. '
                        });
                    }
                    else {
                        return res.send(err);
                    }
                }

                // return a message
                res.json({
                    message: 'Spell created!'
                });
            });

        })

        // get all the spells (accessed at GET http://localhost:8080/api/spells)
        .get(function (req, res) {

            Spell.find({}, function (err, spells) {
                if (err) {
                    res.send(err);
                }

                // return the spells
                res.json(spells);
            });
        });

    // on routes that end in /spells/:spell_id
    // ----------------------------------------------------
    apiRouter.route('/spells/:spell_id')

        // get the spell with that id
        .get(function (req, res) {
            Spell.findById(req.params.spell_id, function (err, spell) {
                if (err) {
                    res.send(err);
                }

                // return that spell
                res.json(spell);
            });
        })

        // update the spell with this id
        .put(function (req, res) {
            Spell.findById(req.params.spell_id, function (err, spell) {

                if (err) {
                    res.send(err);
                }

                // set the new spell information if it exists in the request
                if (req.body.name) {
                    spell.name = req.body.name;
                }
                if (req.body.type) {
                    spell.type = req.body.type;
                }
                if (req.body.cost) {
                    spell.cost = req.body.cost;
                }
                if (req.body.level) {
                    spell.level = req.body.level;
                }
                if (req.body.description) {
                    spell.description = req.body.description;
                }
                if (req.body.constitution) {
                    spell.constitution = req.body.constitution;
                }
                if (req.body.strength) {
                    spell.strength = req.body.strength;
                }
                if (req.body.dexterity) {
                    spell.dexterity = req.body.dexterity;
                }
                if (req.body.intelligence) {
                    spell.intelligence = req.body.intelligence;
                }
                if (req.body.health) {
                    spell.health = req.body.health;
                }
                if (req.body.health) {
                    spell.damage = req.body.damage;
                }

                // save the spell
                spell.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    // return a message
                    res.json({
                        message: 'Spell updated!'
                    });
                });

            });
        })

        // delete the spell with this id
        .delete(function (req, res) {
            Spell.remove({
                _id: req.params.spell_id
            }, function (err, spell) {
                if (err) {
                    res.send(err);
                }

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });

    // on routes that end in /spells/castable
    // ----------------------------------------------------
    apiRouter.route('/spells/level/:level')

        //Get spells castable by a character
        .get(function (req, res) {
            Spell.find({
                level: { $lte : req.params.level }
            }, function (err, spells) {
                if (err) {
                    res.send(err);
                }

                // return the spells
                res.json(spells);
            });
        }) 

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////************NPCS**************//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    // on routes that end in /npcs
    // ----------------------------------------------------
    apiRouter.route('/npcs')
        // create an item (accessed at POST http://localhost:8080/npcs)
        .post(function (req, res) {

            var npc = new Npc(); // create a new instance of the Npc model
            npc.name = req.body.name; // set the npc's name (comes from the request)
            npc.shopOwner = req.body.shopOwner; // set whether or not the npc has a shop (comes from the request)
            npc.shopName = req.body.shopName; // set the npc's shop name (comes from the request)
            npc.questGiver = req.body.questGiver; // set whether or not the npc is a quest giver (comes from the request)
            npc.welcome = req.body.welcome; // set the npc's welcome message (comes from the request)
            npc.thank = req.body.thank //set the npc's thank you message (comes from the request)
            npc.farewell = req.body.farewell; // set the npc's farewell message  (comes from the request)

            npc.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'An npc with that name already exists. '
                        });
                    }
                    else {
                        return res.send(err);
                    }
                }

                // return a message
                res.json({
                    message: 'Npc created!'
                });
            });

        })

        // get all the npcs (accessed at GET http://localhost:8080/api/npcs)
        .get(function (req, res) {

            Npc.find({}, function (err, npcs) {
                if (err) {
                    res.send(err);
                }

                // return the npcs
                res.json(npcs);
            });
        });

    // on routes that end in /npcs/shopOwners
    // ----------------------------------------------------
    apiRouter.route('/npcs/shopOwners')
        
        // get all the npcs who are shop owners (accessed at GET http://localhost:8080/api/npcs/shopOwners)
        .get(function (req, res) {

            // look for an npcs who are shop owners
            Npc.find({
                'shopOwner': true
            }, function (err, npcs) {
                if (err) {
                    res.send(err);
                }

                // return the npcs
                res.json(npcs);
            });
        });

    // on routes that end in /npcs/:npc_id
    // ----------------------------------------------------
    apiRouter.route('/npcs/:npc_id')

        // get the npc with that id
        .get(function (req, res) {
            Npc.findById(req.params.npc_id, function (err, npc) {
                if (err) {
                    res.send(err);
                }

                // return that npc
                res.json(npc);
            });
        })

        // update the npc with this id
        .put(function (req, res) {
            Npc.findById(req.params.npc_id, function (err, npc) {

                if (err) {
                    res.send(err);
                }

                // set the new npc information if it exists in the request
                if (req.body.name) {
                    npc.name = req.body.name;
                }
                if (req.body.shopOwner) {
                    npc.shopOwner = req.body.shopOwner;
                }
                if (req.body.shopName) {
                    npc.shopName = req.body.shopName;
                }
                if (req.body.questGiver) {
                    npc.questGiver = req.body.questGiver;
                }
                if (req.body.welcome) {
                    npc.welcome = req.body.welcome;
                }
                if (req.body.thank) {
                    npc.thank = req.body.thank;
                }
                if (req.body.farewell) {
                    npc.farewell = req.body.farewell;
                }

                // save the npc
                npc.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    // return a message
                    res.json({
                        message: 'Npc updated!'
                    });
                });

            });
        })

        // delete the npc with this id
        .delete(function (req, res) {
            Npc.remove({
                _id: req.params.npc_id
            }, function (err, npc) {
                if (err) {
                    res.send(err);
                }

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////************SHOPS*************//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    // on routes that end in /shops
    // ----------------------------------------------------
    apiRouter.route('/shops')
        // create an item (accessed at POST http://localhost:8080/shops)
        .post(function (req, res) {

            var shop = new Shop(); // create a new instance of the Shop model
            shop.shopOwner = req.body.shopOwner; // Set the shop owner's name (comes from the request)
            shop.item = req.body.item; // set the item being added to the shop's stock (comes from the request)
            shop.price = req.body.price; // set the item's price in the shop (comes from the request)

            shop.save(function (err) {
                if (err) {
                    return res.send(err);                 
                }

                // return a message
                res.json({
                    message: 'Item added to shop!'
                });
            });

        })

        // get all the shops (accessed at GET http://localhost:8080/api/shops)
        .get(function (req, res) {

            Shop.find({}, function (err, shops) {
                if (err) {
                    res.send(err);
                }

                // return the shops
                res.json(shops);
            });
        });

    // on routes that end in /shops/:shop_owner
    // ----------------------------------------------------
    apiRouter.route('/shops/:shop_owner')
    
        // get all shop items belonging to a shop owner
        .get(function (req, res) {
            Shop.find({
                shopOwner: req.params.shop_owner
            }, function (err, shop) {
                if (err) {
                    res.send(err);
                }

                // return the shop items
                res.json(shop);
            });
        })       

        // delete the shop item with this id
        .delete(function (req, res) {
            Shop.remove({
                _id: req.params.shop_owner
            }, function (err, npc) {
                if (err) {
                    res.send(err);
                }
            });
        });

    //////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////*************INVENTORY*************////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    // on routes that end in /inventory/add
    // ----------------------------------------------------
    apiRouter.route('/inventory/add')
        //Add an item to inventory (accessed at POST http://localhost:8080/inventory)
        .put(function (req, res) {

            var inventory = new Inventory(); // create a new instance of the Inventory model
            inventory.characterID = req.body.characterID; // Set the character ID for the inventory item (comes from the request)
            inventory.itemID = req.body.itemID; // Set the item ID for the inventory item (comes from the request)
            inventory.quantity = req.body.quantity;
            
            inventory.save(function (err) {
                if (err) {
                    if (err.code == 11000) {
                        Inventory.findOneAndUpdate(
                            {
                                characterID: req.body.characterID,
                                itemID: req.body.itemID
                            },
                            {
                                $inc: {
                                    quantity: 1
                                }
                            },
                            function (err, items) {

                                // set the new inventory item information if it exists in the request
                                if (req.body.characterID) {
                                    inventory.characterID = req.body.characterID;
                                }
                                if (req.body.itemID) {
                                    inventory.itemID = req.body.itemID;
                                }

                                // save the inventory
                                inventory.save(function (err) {
                                    if (err) {
                                        res.send(err);
                                    }
                                });
                            });
                    }
                }
                
            });
        });

    // on routes that end in /inventory/remove
    // ----------------------------------------------------
    apiRouter.route('/inventory/remove')
        //Remove an item from inventory (accessed at POST http://localhost:8080/inventory)
        .put(function (req, res) {
            Inventory.findOne(
                {
                    characterID: req.body.characterID,
                    itemID: req.body.itemID
                }, function (err, inventory) {
                    // set the new npc information if it exists in the request
                    if (req.body.characterID) {
                        inventory.characterID = req.body.characterID;
                    }

                    if (req.body.itemID) {
                        inventory.itemID = req.body.itemID;
                    }

                    if (req.body.quantity) {
                        inventory.quantity = req.body.quantity;
                    }

                    // save the inventory
                    inventory.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                    });
                });

        });

    // on routes that end in /inventory/:char_id
    // ----------------------------------------------------
    apiRouter.route('/inventory/:char_id')

        //// get all inventory items belonging to a character        
        .get(function (req, res) {

            Inventory.find({
                characterID: req.params.char_id
            }, function (err, inventories) {
                if (err) {
                    res.send(err);
                }

                // return the inventory items
                res.json(inventories);
            });
        });      

    // on routes that end in /inventory/
    apiRouter.route('/inventory/:char_id/:item_id')

        // delete the inventory item with this id
        .delete(function (req, res) {
            Inventory.findOne(
                {
                    characterID: req.params.char_id,
                    itemID: req.params.item_id
                }, function (err, inventory) {

                    // save the inventory
                    inventory.remove(function (err) {
                        if (err) {
                            res.send(err);
                        }
                    });
                });

        });

    //////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////*************EXPERIENCE************////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    apiRouter.route('/level/:level')

        .get(function (req, res) {
            Level.find({
                level: req.params.level
            }, function (err, level) {
                if (err) {
                    res.send(err);
                }

                res.json(level);
            });
        });

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////*********ENCOUNTERS***********//////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    // on routes that end in /encounters
    // ----------------------------------------------------
    apiRouter.route('/encounters')
        // create an item (accessed at POST http://localhost:8080/encounters)
        .post(function (req, res) {

            var encounter = new Encounter(); // create a new instance of the Item model
            encounter.firstCreature = req.body.firstCreature; // set the encounter's first creature (comes from the request)
            encounter.secondCreature = req.body.secondCreature; // set the encounter's second creature (comes from the request)
            encounter.thirdCreature = req.body.thirdCreature; // set the encounter's third creature (comes from the request)
            encounter.experience = req.body.experience; // set the encounter's experience reward (comes from the request)
            encounter.minimumLevel = req.body.minimumLevel; // set the encounter's minimum level (comes from the request)
            encounter.maximumLevel = req.body.maximumLevel; // set the encounter's maximum level (comes from the request)

            encounter.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'An encounter with that name already exists. '
                        });
                    }
                    else {
                        return res.send(err);
                    }
                }

                // return a message
                res.json({
                    message: 'Encounter created!'
                });
            });

        })

        // get all the encounters (accessed at GET http://localhost:8080/api/encounters)
        .get(function (req, res) {

            Encounter.find({}, function (err, encounters) {
                if (err) {
                    res.send(err);
                }

                // return the items
                res.json(encounters);
            });
        });

    // on routes that end in /encounters/:encounter_id
    // ----------------------------------------------------
    apiRouter.route('/encounters/:encounter_id')

        // get the item with that id
        .get(function (req, res) {
            Encounter.findById(req.params.encounter_id, function (err, encounter) {
                if (err) res.send(err);

                // return that item
                res.json(encounter);
            });
        })

        // update the encounter with this id
        .put(function (req, res) {
            Encounter.findById(req.params.encounter_id, function (err, encounter) {

                if (err) {
                    res.send(err);
                }

                // set the new item information if it exists in the request
                if (req.body.firstCreature) {
                    encounter.firstCreature = req.body.firstCreature;
                }
                if (req.body.secondCreature) {
                    encounter.secondCreature = req.body.secondCreature;
                }
                if (req.body.thirdCreature) {
                    encounter.thirdCreature = req.body.thirdCreature;
                }
                if (req.body.experience) {
                    encounter.experience = req.body.experience;
                }
                if (req.body.minimumLevel) {
                    encounter.minimumLevel = req.body.minimumLevel;
                }
                if (req.body.maximumLevel) {
                    encounter.maximumLevel = req.body.maximumLevel;
                }

                // save the encounter
                encounter.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'Encounter updated!'
                    });
                });

            });
        })

        // delete the encounter with this id
        .delete(function (req, res) {
            Encounter.remove({
                _id: req.params.encounter_id
            }, function (err, encounter) {
                if (err) res.send(err);

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });

    // on routes that end in /spells/castable
    // ----------------------------------------------------
    apiRouter.route('/encounters/level/:level')

        //Get encounters suitable for the character based on level
        .get(function(req, res) {
            Encounter.find({
                minimumLevel: { $lte: req.params.level },
                maximumLevel: { $gte: req.params.level }
            }, function(err, encounters) {
                if (err) {
                    res.send(err);
                }

                // return the encounters
                res.json(encounters);
            });
        }) 

    // api endpoint to get user inform
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });



    return apiRouter;
};