// 'use strict';
// var _ = require('underscore');
// var async = require('async');
// var MongoClient = require('mongodb').MongoClient;
// var bearcat = require('bearcat');
// var should = require('should');
// var Role = require('../../../lib/domain/roleAndPermission/role.js');
// var muk = require('muk');
//
// describe('role repository MongoDB and http use case test', function () {
//     var repository;
//
//     before(function (done) {
//         var contextPath = require.resolve('../../../unittest_application_bcontext.json');
//         bearcat.createApp([contextPath]);
//         bearcat.start(function () {
//             repository = bearcat.getBean('roleRepository');
//             done();
//         });
//     });
//     describe('#saveRole(role, callback)//callback(err,isSuccess)', function () {
//         context('save an role', function () {
//             it('should return true if save success', function (done) {
//                 var role = {};
//                 role.roleID = "tagID1";
//                 role.roleName = "tagName1";
//                 role.permissions = [{
//                     permissionID: "permissionID",
//                     permissionName: "permissionName"
//                 }];
//                 role = new Role(role);
//                 repository.saveRole(role, function (err, isSuccess) {
//                     isSuccess.should.be.eql(true);
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#getRoleByID(roleID, callback)//callback(err,role)', function () {
//         context('get role by id', function () {
//             it('should return null if role is null', function (done) {
//                 var roleID = "noRoleID";
//                 repository.getRoleByID(roleID, function (err, role) {
//                     _.isNull(role).should.be.eql(true);
//                     done();
//                 });
//             });
//             it('should return role if success', function (done) {
//                 var roleID = "tagID1";
//                 repository.getRoleByID(roleID, function (err, role) {
//                     role.roleID.should.be.eql("tagID1");
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#getRolesByIDs(roleIDs, callback)//callback(err,roles)', function () {
//         context('get roles by ids', function () {
//             it('should return null if roles is null', function (done) {
//                 var roleIDs = null;
//                 repository.getRolesByIDs(roleIDs, function (err, roles) {
//                     _.isNull(roles).should.be.eql(true);
//                     done();
//                 });
//             });
//             it('should return roles if success', function (done) {
//                 var roleIDs = ["tagID1"];
//                 repository.getRolesByIDs(roleIDs, function (err, roles) {
//                     roles.length.should.be.eql(1);
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
