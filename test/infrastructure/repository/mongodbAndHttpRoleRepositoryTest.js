'use strict';
const _ = require('underscore');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const should = require('should');
const {Role} = require('../../../lib/domain/roleAndPermission');
const MongodbAndHttpRoleRepository = require('../../../lib/infrastructure/repository/mongodbAndHttpRoleRepository');

describe('role repository MongoDB and http use case test', ()=> {
    let repository;
    before(()=> {
        repository = new MongodbAndHttpRoleRepository();
    });
    describe('#saveRole(role, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('save an role', ()=> {
            it('should return true if save success', (done)=> {
                var role = {};
                role.roleID = "roleID";
                role.roleName = "roleName";
                role.permissionIDs = [{
                    permissionID: "permissionID"
                }];
                role = new Role(role);
                repository.saveRole(role, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getRoleByID(roleID, traceContext, callback)//callback(err,role)', ()=> {
        context('get role by id', ()=> {
            it('should return null if role is null', (done)=> {
                var roleID = "noRoleID";
                repository.getRoleByID(roleID, {}, (err, role)=> {
                    _.isNull(role).should.be.eql(true);
                    done();
                });
            });
            it('should return role if success', (done)=> {
                var roleID = "roleID";
                repository.getRoleByID(roleID, {}, (err, role)=> {
                    role.roleID.should.be.eql(roleID);
                    done();
                });
            });
        });
    });
    describe('#getRoles(traceContext, callback)//callback(err,roles)', ()=> {
        context('get roles', ()=> {
            it('should return roles if success', (done)=> {
                repository.getRoles({}, (err, roles)=> {
                    roles.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#delRoleByID(roleID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('get role by id', ()=> {
            it('should return null if role is null', (done)=> {
                var roleID = "noRoleID";
                repository.delRoleByID(roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return role if success', (done)=> {
                var roleID = "roleID";
                repository.delRoleByID(roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after((done)=> {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Role`, (err, db)=> {
            if (err) {
                done(err);
                return;
            }
            db.collection('RoleInfo').drop((err, response)=> {
                db.close();
                done();
            });
        });
    });
});
