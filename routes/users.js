const express = require('express'),
    collectionName = 'users';
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    db = req.app.get('db');
    var collection = db.collection('users');
    collection.find().toArray((err, items) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(items);
    });
});


router.post('/', (req, res) => {
    var user = req.body;
    db = req.app.get('db');
    var collection = db.collection(collectionName);
    collection.insert(user, (err, result) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(result[0]);
    });
});

module.exports = router;
