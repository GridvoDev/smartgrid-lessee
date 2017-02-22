'use strict';
const _ = require('underscore');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const should = require('should');
const {Permission} = require('../../../lib/domain/roleAndPermission');
const MongodbAndHttpPermissionRepository = require('../../../lib/infrastructure/repository/mongodbAndHttpPermissionRepository');

describe('permission repository MongoDB and http use case test', ()=> {
    let repository;
    before(()=> {
        repository = new MongodbAndHttpPermissionRepository();
    });
    describe('#savePermission(permission, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('save an permission', ()=> {
            it('should return true if save success', (done)=> {
                var permission = {};
                permission.permissionID = "permissionID";
                permission.permissionName = "permissionName";
                permission = new Permission(permission);
                repository.savePermission(permission, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getAllPermission(traceContext, callback)//callback(err,permissions)', ()=> {
        context('get all permission', ()=> {
            it('if success', (done)=> {
                repository.getAllPermission({}, (err,permissions)=> {
                    permissions.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#getPermissionByID(permissionID, traceContext, callback)//callback(err,permission)', ()=> {
        context('get permissions by ids', ()=> {
            it('should return null if permissions is null', (done)=> {
                var permissionID = "noPermissionID";
                repository.getPermissionByID(permissionID, {}, function (err, permission) {
                    _.isNull(permission).should.be.eql(true);
                    done();
                });
            });
            it('should return roles if success', (done)=> {
                var permissionID = "permissionID";
                repository.getPermissionByID(permissionID, {}, function (err, permission) {
                    permission.permissionID.should.be.eql(permissionID);
                    done();
                });
            });
        });
    });
    describe('#delPermissionByID(permissionID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('del permissions by id', ()=> {
            it('fail if no this permissionID', (done)=> {
                var permissionID = "noPermissionID";
                repository.delPermissionByID(permissionID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', (done)=> {
                var permissionID = "permissionID";
                repository.delPermissionByID(permissionID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after((done)=> {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Permission`, (err, db)=> {
            if (err) {
                done(err);
                return;
            }
            db.collection('PermissionInfo').drop((err, response)=> {
                db.close();
                done();
            });
        });
    });
});
