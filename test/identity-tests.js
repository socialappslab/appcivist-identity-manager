var should = require('should');
var assert = require('assert');
var request = require('supertest');
var express = require('express');
var dbutils = require('../lib/dbutils.js');

var app = require('../start');

describe('Routing', () => {
    var url = 'http://localhost:' + process.env.USNB_ENTITY_MANAGER_PORT;

    before((done) => {
        dbutils.cleardb(() => {
            done();
        });
    });

    after((done) => {
        dbutils.cleardb(() => {
            done();
        });
    });

    //Create tests
    //
    describe('Identity', () => {
        it('should successfully create a new identity', (done) => {
            var profile = {
                serviceId: "facebookmessenger",
                userId: "user@universe.u",
                identity: "useratfacebook",
                enabled: true
            };
            request(url)
                .post('/identities')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create another new identity', (done) => {
            var profile = {
                serviceId: "email",
                userId: "test@elsewhere.e",
                identity: "test@elsewhere.e",
                enabled: true
            };
            request(url)
                .post('/identities')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create even another new identity', (done) => {
            var profile = {
                serviceId: "twitterdm",
                userId: "third@ss.com",
                identity: "third",
                enabled: true
            };
            request(url)
                .post('/identities')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });


        it('should successfully create even another identity for a existing user', (done) => {
            var profile = {
                serviceId: "email",
                userId: "third@ss.com",
                identity: "third@email.org",
                enabled: true
            };
            request(url)
                .post('/identities')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create even another DISABLED identity for a existing user', (done) => {
            var profile = {
                serviceId: "slack",
                userId: "third@ss.com",
                identity: "third",
                enabled: false
            };
            request(url)
                .post('/identities')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        //Read tests
        //
        it('should return five identities of three users', (done) => {
            request(url)
                .get('/identities')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(5);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'user@universe.u');
                    assert.equal(array[1].userId, 'test@elsewhere.e');
                    assert.equal(array[2].userId, 'third@ss.com');
                    assert.equal(array[3].userId, 'third@ss.com');
                    assert.equal(array[4].userId, 'third@ss.com');
                    done();
                });
        });

        it('should return two ENABLED identities of an existing user', (done) => {
            request(url)
                .get('/identities/third@ss.com?enabled=true')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(2);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'third@ss.com');
                    assert.equal(array[0].serviceId, 'email');
                    assert.equal(array[1].userId, 'third@ss.com');
                    assert.equal(array[1].serviceId, 'twitterdm');
                    done();
                });
        });

        it('should return one DISABLED identity of an existing user', (done) => {
            request(url)
                .get('/identities/third@ss.com?enabled=false')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(1);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'third@ss.com');
                    assert.equal(array[0].serviceId, 'slack');
                    done();
                });
        });

        it('should return the email identity of an existing user', (done) => {
            request(url)
                .get('/identities/third@ss.com?serviceId=email')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(1);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'third@ss.com');
                    assert.equal(array[0].serviceId, 'email');
                    done();
                });
        });

        it('should return the twitterdm identity of an existing user', (done) => {
            request(url)
                .get('/identities/third@ss.com?serviceId=twitterdm')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(1);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'third@ss.com');
                    assert.equal(array[0].serviceId, 'twitterdm');
                    done();
                });
        });

        it('should return all email identities', (done) => {
            request(url)
                .get('/identities?serviceId=email')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(2);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].serviceId, 'email');
                    assert.equal(array[1].serviceId, 'email');
                    done();
                });
        });

    });
});
