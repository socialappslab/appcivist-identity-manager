const express = require('express'),
    collectionName = 'identities';
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

    /*
        { 
            "serviceId": 'email',
            "userId": 'appcivistUserUUID',
            "identity": "<value of notifications.service.email.identity OR appcivistUserEmail if the other is empty>" ,
            "enabled": <value of notifications.service.email>
        }
    */
router.put('/', (req, res, next) => {

    console.log('PUT Identity');
    console.log(req.body);
    console.log('--------------------------');
    db = req.app.get('db');
    var collection = db.collection(collectionName);

    var serviceId = req.body.serviceId;
    var identity = req.body.identity;
    var userId =  req.body.userId;
    var enabled = req.body.enabled;

    getIdentity(db, userId, serviceId, null, null, (err, items) => {
        if (err){
            res.status(500).send(err);
        }
        else{
            
            if (items.length > 0){
                //Do entities update
                console.log('Updating Identity');
                var criteria = {
                    serviceId: req.body.serviceId,
                    userId:req.body.userId
                };

                var updateCriteria ={
                    $set:{}
                };
                
                if(identity != undefined){
                    updateCriteria.$set.identity = req.body.identity;
                }
                if(enabled != undefined){
                    updateCriteria.$set.enabled = req.body.enabled;
                }
                
                collection.update(criteria, updateCriteria, (err, result) => {
                        if (err){
                            console.log('Error Updating Identity');
                            res.status(500).send(err);
                        }else{
                            console.log('Updating Identity. OK');
                            res.send(result[0]);
                        }
                        
                });
                

            }else{
                //insert new identity
                console.log('Creating Identity');
                collection.insert(req.body, (err, result) => {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(result[0]);
                });
                console.log('Finish Creating Identity');

            }

        }

    });
});


router.post('/', (req, res) => {
    var identity = req.body;
    db = req.app.get('db');
    var collection = db.collection(collectionName);
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
    var collection = db.collection(collectionName);
    collection.find(query).toArray((err, items) => {
        callback(err, items);
    });
};

module.exports = router;
module.exports.getIdentity = getIdentity;
