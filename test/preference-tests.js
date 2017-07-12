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

    //Create tests
    //
    describe('Preference', () => {
        it('should successfully create a new preference', (done) => {
            var profile = {
                userId: "user@universe.u",
                serviceId: "facebookmessenger"
            };
            request(url)
                .post('/preferences')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create another new preference', (done) => {
            var profile = {
                userId: "me@universe.u",
                serviceId: "email"
            };
            request(url)
                .post('/preferences')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should return an error due to duplicate userId', (done) => {
            var profile = {
                userId: "me@universe.u",
                serviceId: "email"
            };
            request(url)
                .post('/preferences')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 500);
                    done();
                });
        });

        //Read tests
        //
        it('should return two preferences', (done) => {
            request(url)
                .get('/preferences')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(2);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'user@universe.u');
                    assert.equal(array[0].serviceId, 'facebookmessenger');
                    assert.equal(array[1].userId, 'me@universe.u');
                    assert.equal(array[1].serviceId, 'email');
                    done();
                });
        });

        it('should return one preferences for a given user', (done) => {
            request(url)
                .get('/preferences/me@universe.u')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(1);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'me@universe.u');
                    assert.equal(array[0].serviceId, 'email');
                    done();
                });
        });

        it('should return zero preferences for a non-existent user', (done) => {
            request(url)
                .get('/preferences/whoami@universe.u')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(0);
                    done();
                });
        });

        //Update Tests
        //

        it('should successfully update a preference given a user', (done) => {
            var profile = {
                serviceId: 'anewservice'
            };
            request(url)
                .put('/preferences/' + 'me@universe.u')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should return the updated preference', (done) => {
            request(url)
                .get('/preferences/me@universe.u')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(1);
                    array = JSON.parse(res.text);
                    assert.equal(array[0].userId, 'me@universe.u');
                    assert.equal(array[0].serviceId, 'anewservice');
                    done();
                });
        });

    });
});
