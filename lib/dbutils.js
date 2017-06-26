var mongo = require('mongodb').MongoClient;
var mongoUri = process.env.USNB_MONGO_URI_ENTITY_MANAGER;

console.log('mongoUri: ', mongoUri);

exports.mongoUri = mongoUri;
exports.BSON = mongo.BSONPure;

exports.cleardb = function(doneit) {

    console.log('Clearing Database');

    mongo.connect(mongoUri, function(err, db) {
        if (err) {
            return console.dir(err);
        }

        db.collection('signalLog', function(err, collection) {
            if (err) {
                return console.dir(err);
            }
            collection.remove({}, {
                w: 1
            }, function(err, result) {
                if (err) {
                    return console.dir(err);
                }
                db.collection('users', function(err, collection) {
                    if (err) {
                        return console.dir(err);
                    }
                    collection.remove({}, {
                        w: 1
                    }, function(err, result) {
                        if (err) {
                            return console.dir(err);
                        }
                        db.collection('services', function(er, collection) {
                            if (err) {
                                return console.dir(err);
                            }
                            collection.remove({}, {
                                w: 1
                            }, function(err, result) {
                                if (err) {
                                    return console.dir(err);
                                }
                                db.collection('identities', function(er, collection) {
                                    if (err) {
                                        return console.dir(err);
                                    }
                                    collection.remove({}, {
                                        w: 1
                                    }, function(err, result) {
                                        if (err) {
                                            return console.dir(err);
                                        }
                                        db.close();
                                        console.log('Database cleared');
                                        doneit();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
