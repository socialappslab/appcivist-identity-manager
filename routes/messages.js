const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb').MongoClient,
    identities = require('./identities'),
    Message = require('scb-node-parser/message'),
    sender = require('../amqp-sender');
//var mongoclass = require('mongodb');

mongo.BSONPure = require('bson').BSONPure;
var BSON = mongo.BSONPure;


/*
 * Send a message to an entity using its favorite
 * social interaction service
 */
router.post('/', (req, res) => {
    var userId = req.body.to.name;
    console.log(userId);
    var query = {};
    query.userId = userId;
    db = req.app.get('db');
    //query preferences to retrieve the serviceId
    var collection = db.collection('preferences');
    collection.find(query).toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            //get the actual identity for the serviceId
            var serviceId = items[0].serviceId;
            identities.getIdentity(db, userId, serviceId, null, null, (err, items) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var message = new Message({
                        name: userId,
                        uniqueName: items[0].identity
                    }, {
                        name: '',
                        uniqueName: ''
                    }, '', req.body.message.text);

                    //TODO: verify if message was sent correctly
                    sender.post(message, serviceId);
                    res.send(items[0]);
                }
            });
        }
    });
});


module.exports = router;
