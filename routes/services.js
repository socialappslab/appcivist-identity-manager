var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    db = req.app.get('db');
    var collection = db.collection('services');
    collection.find().toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
});


router.post('/', (req, res) => {
    console.log('add service');
    var service = req.body;
    db = req.app.get('db');
    var collection = db.collection('services');
    collection.insert(service, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result[0]);
        }
    });
});

module.exports = router;
