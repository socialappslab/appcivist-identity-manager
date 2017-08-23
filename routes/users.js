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

router.get('/:userId?', (req, res, next) => {
    console.log('GET USER by ID');
    db = req.app.get('db');
    var collection = db.collection(collectionName);
    var userId = req.params.userId;
    getPreference(db, userId, (err, items) => {
        if (err){
            res.status(500).send(err);
        }
        else{
            console.log(items.length);
            if(items.length > 0) {
               res.send(items[0]);
            }else{
                console.log('User not found');
                res.status(404).send({});
                
            }
        }
            
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
