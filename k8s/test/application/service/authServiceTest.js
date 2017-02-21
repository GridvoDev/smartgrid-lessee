// 'use strict';
// var _ = require('underscore');
// var bearcat = require('bearcat');
// var should = require('should');
//
// describe('auth service use case test', function () {
//     var service;
//     before(function (done) {
//         var contextPath = require.resolve('../../../unittest_application_bcontext.json');
//         bearcat.createApp([contextPath]);
//         bearcat.start(function () {
//             service = bearcat.getBean('authService');
//             done();
//         });
//     });
//     describe('#checkMemberPermission(memberID, permissionID, callback)//callback(err,isSuccess)', function () {
//         context('check member permission', function () {
//             it('fail if no memberID', function (done) {
//                 var memberID = "noMemberID";
//                 var permissionID = "permissionID";
//                 service.checkMemberPermission(memberID, permissionID, function (err, isSuccess) {
//                     isSuccess.should.be.eql(false);
//                     done();
//                 });
//             });
//             it('fail if no permissionID', function (done) {
//                 var memberID = "memberID";
//                 var permissionID = "noPermissionID";
//                 service.checkMemberPermission(memberID, permissionID, function (err, isSuccess) {
//                     isSuccess.should.be.eql(false);
//                     done();
//                 });
//             });
//             it('success', function (done) {
//                 var memberID = "memberID";
//                 var permissionID = "permissionID";
//                 service.checkMemberPermission(memberID, permissionID, function (err, isSuccess) {
//                     isSuccess.should.be.eql(true);
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#authMember(memberID, callback)//callback(err,memberData)', function () {
//         context('auth member', function () {
//             it('fail if no memberID', function (done) {
//                 var memberID = "noMemberID";
//                 service.authMember(memberID, function (err, memberData) {
//                     _.isNull(memberData).should.be.eql(true);
//                     done();
//                 });
//             });
//             it('success', function (done) {
//                 var memberID = "memberID";
//                 service.authMember(memberID, function (err, memberData) {
//                     memberData.memberID.should.be.eql("memberID");
//                     done();
//                 });
//             });
//         });
//     });
// });