// 'use strict';
// var _ = require('underscore');
// var async = require('async');
// var MongoClient = require('mongodb').MongoClient;
// var bearcat = require('bearcat');
// var should = require('should');
// var Permission = require('../../../lib/domain/roleAndPermission/permission.js');
//
// describe('permission repository MongoDB and http use case test', function () {
//     var repository;
//
//     before(function (done) {
//         var contextPath = require.resolve('../../../unittest_application_bcontext.json');
//         bearcat.createApp([contextPath]);
//         bearcat.start(function () {
//             repository = bearcat.getBean('permissionRepository');
//             done();
//         });
//     });
//     describe('#savePermission(permission, callback)//callback(err,isSuccess)', function () {
//         context('save an permission', function () {
//             it('should return true if save success', function (done) {
//                 var permission = {};
//                 permission.permissionID = "permissionID";
//                 permission.permissionName = "permissionName";
//                 permission = new Permission(permission);
//                 repository.savePermission(permission, function (err, isSuccess) {
//                     isSuccess.should.be.eql(true);
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#getAllPermission(callback)//callback(err,permission)', function () {
//         context('get all permission', function () {
//             it('if success', function (done) {
//                 repository.getAllPermission(function (err,permission) {
//                     permission.length.should.be.eql(1);
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#getPermissionsByIDs(permissionIDs, callback)//callback(err,permissions)', function () {
//         context('get permissions by ids', function () {
//             it('should return null if permissions is null', function (done) {
//                 var permissionIDs = null;
//                 repository.getPermissionsByIDs(permissionIDs, function (err, permissions) {
//                     _.isNull(permissions).should.be.eql(true);
//                     done();
//                 });
//             });
//             it('should return roles if success', function (done) {
//                 var permissionIDs = ["permissionID"];
//                 repository.getPermissionsByIDs(permissionIDs, function (err, permissions) {
//                     permissions.length.should.be.eql(1);
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#delPermissionByID(permissionID, callback)//callback(err,isSuccess)', function () {
//         context('del permissions by id', function () {
//             it('fail if no this permissionID', function (done) {
//                 var permissionID = "noPermissionID";
//                 repository.delPermissionByID(permissionID, function (err, isSuccess) {
//                     isSuccess.should.be.eql(false);
//                     done();
//                 });
//             });
//             it('success', function (done) {
//                 var permissionID = "permissionID";
//                 repository.delPermissionByID(permissionID, function (err, isSuccess) {
//                     isSuccess.should.be.eql(true);
//                     done();
//                 });
//             });
//         });
//     });
//     after(function (done) {
//         var MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST ? process.env.MONGODB_SERVICE_HOST : "127.0.0.1";
//         var MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT ? process.env.MONGODB_SERVICE_PORT : "27017";
//         MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/TestGLesseeAuthentication`, function (err, db) {
//             if (err) {
//                 done(err);
//                 return;
//             }
//             db.collection('role').drop(function (err, response) {
//                 db.close();
//                 done();
//             });
//         });
//     });
// });
