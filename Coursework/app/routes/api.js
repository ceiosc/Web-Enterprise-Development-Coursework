var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
var Character = require('../models/character');
var Item = require('../models/item');
var Creature = require('../models/creature');
var Spell = require('../models/spell');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {

    var apiRouter = express.Router();

    //*** CODE TO GENERATE FIRST SPELL IN A TABLE DURING DEVELOPMENT***
    //route to generate sample spell 
    apiRouter.post('/sample', function (req, res) {

        // look for a spell called fire blast.
        Spell.findOne({
            'name': 'Fire Blast'
        }, function (err, spell) {

            // if there is no spell called fire blast, create one
            if (!spell) {
                var sampleSpell = new Spell();

                sampleSpell.name = 'Fire Blast';
                sampleSpell.type = 'Damage';
                sampleSpell.cost = 2;
                sampleSpell.level = 1;
                sampleSpell.description = 'Deals 3 Damage to the enemy';
                sampleSpell.constitution = 0;
                sampleSpell.strength = 0;
                sampleSpell.dexterity = 0;
                sampleSpell.intelligence = 0;
                sampleSpell.health = 0;
                sampleSpell.damage = 3;

                sampleSpell.save();
            } else {
                console.log(spell);

                // if there is a fire blast spell, update it's damage value
                spell.damage = 2;
                spell.save();
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
        }).select('_id name username password').exec(function (err, user) {

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
                        username: user.username
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
            char.constitution = 1;
            char.strength = 1;
            char.dexterity = 1;
            char.intelligence = 1;

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
            Character.findOneAndUpdate({
                'userID': req.params.user_id
            }, function (err, character) {

                if (err) {
                    res.send(err);
                }

                // set the new character information if it exists in the request
                if (req.body.level) {
                    character.level = req.body.level;
                }
                if (req.body.constitution) {
                    character.constitution = req.body.constitution;
                }
                if (req.body.strength) {
                    character.strength = req.body.strength;
                }
                if (req.body.dexterity){
                    character.dexterity = req.body.dexterity;
                }
                if (req.body.intelligence) {
                    character.intelligence = req.body.intelligence;
                }
                if (req.body.head) {
                    character.head = req.body.head;
                }
                if (req.body.chest){
                    character.chest = req.body.chest;
                }
                if (req.body.legs) {
                    character.legs = req.body.legs;
                }
                if (req.body.boots) {
                    character.boots = req.body.boots;
                }
                if (req.body.mainhand) {
                    character.mainhand = req.body.mainhand;
                }
                if (req.body.offhand) {
                    character.offhand = req.body.offhand;
                }
                if (req.body.ring) {
                    character.ring = req.body.ring;
                }
                if (req.body.amulet) {
                    character.amulet = req.body.amulet;
                }

                // save the user
                character.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'Character updated!'
                    });
                });
            })
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
            item.slot = req.body.slot; // set the item's slot (comes from the request)
            item.constitution = req.body.constitution; // set the item's constitution bonus (comes from the request)
            item.strength = req.body.strength; // set the item's strength bonus (comes from the request)
            item.dexterity = req.body.dexterity; // set the item's dexterity bonus (comes from the request)
            item.intelligence = req.body.intelligence; // set the item's intelligence bonus (comes from the request)
            item.health = req.body.health; // set the item's health bounus (comes from the request)

            item.save(function (err) {
                console.log(err);
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
                console.log(err);
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
                console.log(err);
                if (err) {
                    // duplicate entry
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'An spell with that name already exists. '
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

                // set the new creature information if it exists in the request
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
                if(req.body.health) {
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

    apiRouter.route('/game/inventory:char_id')

    apiRouter.route('/game/quest/:char_id')






    // api endpoint to get user information
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });



    return apiRouter;
};