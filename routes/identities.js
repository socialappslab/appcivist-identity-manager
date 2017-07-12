const express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
//var mongoclass = require('mongodb');
var app = require('../app');

mongo.BSONPure = require('bson').BSONPure;
var BSON = mongo.BSONPure;

/* GET identities listing. */
router.get('/', (req, res, next) => {
    db = req.app.get('db');

    var serviceId = req.query.serviceId;
    var identity = req.query.identity;

    getIdentity(db, null, serviceId, null, identity, (err, items) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(items);

    });
});


router.post('/', (req, res) => {
    var identity = req.body;
    db = req.app.get('db');
    var collection = db.collection('identities');
    collection.insert(identity, (err, result) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(result[0]);

    });
});

/*
 * Get identities for user with ID 'userId'
 * -userId: the ID of the userId
 * -enabled: true | false to get enabled or disabled identities
 */

router.get('/:userId?/:serviceId?/:enabled?', (req, res) => {
    var userId = req.params.userId;
    var serviceId = req.query.serviceId;
    var enabled = req.query.enabled;
    db = req.app.get('db');
    getIdentity(db, userId, serviceId, enabled, null, (err, items) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(items);

    });
});

function getIdentity(db, userId, serviceId, enabled, identity, callback) {
    var query = {};
    if (typeof userId !== 'undefined' && userId !== null)
        query.userId = userId;
    if (typeof enabled !== 'undefined' && enabled !== null)
        query.enabled = (enabled == 'true');
    if (typeof serviceId !== 'undefined' && serviceId !== null)
        query.serviceId = serviceId;
    if (typeof identity !== 'undefined' && identity !== null)
        query.identity = identity;
    console.log(query);
    var collection = db.collection('identities');
    collection.find(query).toArray((err, items) => {
        callback(err, items);
    });
};

module.exports = router;
module.exports.getIdentity = getIdentity;
