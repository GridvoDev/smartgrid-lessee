// 'use strict';
// var _ = require('underscore');
// var async = require('async');
// var MongoClient = require('mongodb').MongoClient;
// var bearcat = require('bearcat');
// var should = require('should');
// var Member = require('../../../lib/domain/lesseeAndMember/member.js');
// var muk = require('muk');
//
// describe('member repository MongoDB and http use case test', function () {
//     var repository;
//
//     before(function (done) {
//         var contextPath = require.resolve('../../../unittest_application_bcontext.json');
//         bearcat.createApp([contextPath]);
//         bearcat.start(function () {
//             repository = bearcat.getBean('memberRepository');
//             done();
//         });
//     });
//     describe('#getMemberByID(memberID, callback)//callback(err,member)', function () {
//         context('get an member for id', function () {
//             it('should return null if no this member', function (done) {
//                var memberID = "noMemberID";
//                repository.getMemberByID(memberID, function (err, member) {
//                    _.isNull(member).should.be.eql(true);
//                    done();
//                });
//             });
//             it('should return member if http is ok', function (done) {
//                 var mockRequest = function (options, callback) {//TODO 放在before里
//                     callback(null, {}, {
//                         errcode: 0,
//                         errcodemsg: "ok",
//                         userInfo: {
//                             corpID: "corpID",
//                             userID: "userID",
//                             username: "username",
//                             tags: [{
//                                 tagID: 'tagsID1',
//                                 tagName: "tagsName1"
//                             }, {
//                                 tagID: 'tagsID2',
//                                 tagName: "tagsName2"
//                             }],
//                             state: "follow"
//                         }
//                     });
//                 };
//                 muk(repository, "__httpRequest__", mockRequest);
//                 var memberID = "memberID";
//                 repository.getMemberByID(memberID, function (err, member) {
//                     member.memberID.should.be.eql("userID");
//                     member.memberInfo.memberName.should.be.eql("username");
//                     member.lesseeID.should.be.eql("corpID");
//                     member.roles.length.should.be.eql(2);
//                     member.state.should.be.eql("follow");
//                     done();
//                 });
//             });
//             after(function () {
//                 muk.restore();
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
//             db.collection('lessee').drop(function (err, response) {
//                 db.close();
//                 done();
//             });
//         });
//     });
// });
