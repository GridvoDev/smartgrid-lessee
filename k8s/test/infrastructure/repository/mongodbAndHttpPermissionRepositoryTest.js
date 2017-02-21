'use strict';
const _ = require('underscore');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const should = require('should');
const {Permission} = require('../../../lib/domain/roleAndPermission');
const MongodbAndHttpPermissionRepository = require('../../../lib/infrastructure/repository/mongodbAndHttpPermissionRepository');

describe('permission repository MongoDB and http use case test', function () {
    let repository;
    before(()=> {
        repository = new MongodbAndHttpPermissionRepository();
    });
    describe('#savePermission(permission, callback)//callback(err,isSuccess)', function () {
        context('save an permission', function () {
            it('should return true if save success', function (done) {
                var permission = {};
                permission.permissionID = "permissionID";
                permission.permissionName = "permissionName";
                permission = new Permission(permission);
                repository.savePermission(permission, {}, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getAllPermission(callback)//callback(err,permission)', function () {
        context('get all permission', function () {
            it('if success', function (done) {
                repository.getAllPermission({}, function (err,permission) {
                    permission.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#getPermissionByID(permissionID, callback)//callback(err,permissions)', function () {
        context('get permissions by ids', function () {
            it('should return null if permissions is null', function (done) {
                var permissionID = "noPermissionID";
                repository.getPermissionByID(permissionID, {}, function (err, permissions) {
                    _.isNull(permissions).should.be.eql(true);
                    done();
                });
            });
            it('should return roles if success', function (done) {
                var permissionID = "permissionID";
                repository.getPermissionByID(permissionID, {}, function (err, permission) {
                    permission.permissionID.should.be.eql(permissionID);
                    done();
                });
            });
        });
    });
    describe('#delPermissionByID(permissionID, callback)//callback(err,isSuccess)', function () {
        context('del permissions by id', function () {
            it('fail if no this permissionID', function (done) {
                var permissionID = "noPermissionID";
                repository.delPermissionByID(permissionID, {}, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', function (done) {
                var permissionID = "permissionID";
                repository.delPermissionByID(permissionID, {}, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(function (done) {
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
