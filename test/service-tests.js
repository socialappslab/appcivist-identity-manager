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
    describe('Service', () => {
        it('should successfully create a new service', (done) => {
            var profile = {
                serviceId: 'email',
                name: 'Email'
            };
            request(url)
                .post('/services')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create another new service', (done) => {
            var profile = {
                serviceId: 'facebookmessenger',
                name: 'Facebook Messenger'
            };
            request(url)
                .post('/services')
                .send(profile)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create even another new service', (done) => {
            var profile = {
                serviceId: 'twitterdm',
                name: 'Twitter Direct Messages'
            };
            request(url)
                .post('/services')
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
        it('should return three services', (done) => {
            request(url)
                .get('/services')
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(3);
                    usersArray = JSON.parse(res.text);
                    assert.equal(usersArray[0].serviceId, 'email');
                    assert.equal(usersArray[1].serviceId, 'facebookmessenger');
                    assert.equal(usersArray[2].serviceId, 'twitterdm');
                    done();
                });
        });
    });
});
