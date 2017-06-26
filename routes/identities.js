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

router.get('/:userId/:enabled', function(req, res) {
    var id = req.params.userId;
    var enabled = req.params.enabled;
    console.log(id);
    console.log(enabled);
    db = req.app.get('db');
    var collection = db.collection('identities');
    collection.find({
        'userId': id,
        'enabled': (enabled == "true")
    }).toArray(function(err, items) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
});

module.exports = router;
