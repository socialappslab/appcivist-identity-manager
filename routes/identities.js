var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
//var mongoclass = require('mongodb');

mongo.BSONPure = require('bson').BSONPure;
var BSON = mongo.BSONPure;

/* GET identities listing. */
router.get('/', (req, res, next) => {
    db = req.app.get('db');
    var collection = db.collection('identities');
    collection.find().toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
});


router.post('/', (req, res) => {
    var identity = req.body;
    db = req.app.get('db');
    var collection = db.collection('identities');
    collection.insert(identity, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result[0]);
        }
    });
});

/*
 * Get identities for user with ID 'userId'
 * -userId: the ID of the userId
 * -enabled: true | false to get enabled or disabled identities
 */

router.get('/:userId?/:serviceId?/:enabled?', function(req, res) {
    var id = req.params.userId;
    var enabled = req.query.enabled;
    var serviceId = req.query.serviceId;
    console.log("id " + id);
    var query = {};
    query.userId = id;
    if (typeof enabled !== 'undefined' && enabled !== null)
        query.enabled = (enabled == 'true');
    if (typeof serviceId !== 'undefined' && serviceId !== null)
        query.serviceId = serviceId;
    console.log(query);
    db = req.app.get('db');
    var collection = db.collection('identities');
    collection.find(query).toArray(function(err, items) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
});


module.exports = router;
