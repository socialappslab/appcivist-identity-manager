const express = require('express'),
    collectionName = 'preferences';
var router = express.Router();

/* GET preferences listing. A preference looks like this:

{
    "userId": "user@universe.u",
    "serviceId": "facebookmessenger"
}

*/
router.get('/:userId?', (req, res, next) => {
    db = req.app.get('db');
    var collection = db.collection(collectionName);
    var userId = req.params.userId;
    getPreference(db, userId, (err, items) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(items);
    });
});


router.post('/', (req, res) => {
    var preference = req.body;
    db = req.app.get('db');
    var collection = db.collection(collectionName);
    collection.insert(preference, (err, result) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(result[0]);
    });
});

router.put('/:userId', (req, res) => {
    var userId = req.params.userId;
    var serviceId = req.body.serviceId;
    var criteria = {};
    criteria.userId = userId;
    db = req.app.get('db');
    var collection = db.collection(collectionName);
    collection.update(criteria, {
        $set: {
            serviceId: serviceId
        }
    }, (err, result) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(result[0]);
    });
});


function getPreference(db, userId, callback) {
    var query = {};
    if (typeof userId !== 'undefined' && userId !== null)
        query.userId = userId;
    var collection = db.collection(collectionName);
    collection.find(query).toArray((err, items) => {
        callback(err, items);
    });
};

module.exports = router;
module.exports.getPreference = getPreference;
