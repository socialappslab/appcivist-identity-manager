var app = require('./app');
var mongo = require('mongodb').MongoClient;

var port = (process.env.USNB_ENTITY_MANAGER_PORT);

mongo.connect(process.env.USNB_MONGO_URI_ENTITY_MANAGER, (err, database) => {
    if (err)
        throw err;
    //create collection
    database.createCollection("preferences", (err, collection) => {
        if (err)
            throw err;

        database.collection('users').createIndex({
            "userId": 1
        }, {
            unique: true
        });

        database.collection('services').createIndex({
            "serviceId": 1
        }, {
            unique: true
        });

        database.collection('identities').createIndex({
            "userId": 1,
            "serviceId": 1
        }, {
            unique: true
        });

        database.collection('preferences').createIndex({
            "userId": 1
        }, {
            unique: true
        });
    });

    app.set('db', database);

    console.log("Running in :" + process.env.NODE_ENV);
    console.log('About to start listening');
    app.listen(port);
    console.log('Listening on port: ', port);
});
