var should = require('should');
var assert = require('assert');
var request = require('supertest');
var express = require('express');
var dbutils = require('../lib/dbutils.js');

var app = require('../start');

describe('Routing', function() {
    var url = 'http://localhost:' + process.env.USNB_ENTITY_MANAGER_PORT;

    before(function(done) {
        dbutils.cleardb(function() {
            done();
        });
    });

    //Create tests
    //
    describe('User', function() {
        it('should successfully create a new user', function(done) {
            var profile = {
                userId: 'user@universe.u',
                name: 'Test User'
            };
            request(url)
                .post('/users')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create another new user', function(done) {
            var profile = {
                userId: 'test@elsewhere.e',
                name: 'Test User2'
            };
            request(url)
                .post('/users')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create even another new user', function(done) {
            var profile = {
                userId: 'third@ss.com',
                name: 'Third One'
            };
            request(url)
                .post('/users')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        //Read tests
        //
        it('should return three users', function(done) {
            request(url)
                .get('/users')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(3);
                    usersArray = JSON.parse(res.text);
                    assert.equal(usersArray[0].userId, 'user@universe.u');
                    assert.equal(usersArray[1].userId, 'test@elsewhere.e');
                    assert.equal(usersArray[2].userId, 'third@ss.com');
                    done();
                });
        });
    });
});
