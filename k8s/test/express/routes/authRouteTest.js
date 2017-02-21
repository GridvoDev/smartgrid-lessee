// var _ = require('underscore');
// var async = require('async');
// var bearcat = require('bearcat');
// var should = require('should');
// var request = require('supertest');
// var express = require('express');
// var bodyParser = require('body-parser');
// var authRouter = require('../../../lib/express/routes/auth.js');
// var errCodeTable = require('../../../lib/express/util/errCode.js');
//
// describe('auth route use case test', function () {
//     var app;
//     var server;
//     before(function (done) {
//         async.waterfall([
//             function (callback) {
//                 app = express();
//                 app.use(bodyParser.json());
//                 app.use(bodyParser.urlencoded({extended: false}));
//                 app.use('/', authRouter);
//                 server = app.listen(3001, callback);
//             },
//             function (callback) {
//                 var bearcatContextPath = require.resolve("../../../unittest_express_bcontext.json");
//                 bearcat.createApp([bearcatContextPath]);
//                 bearcat.start(function () {
//                     app.set('bearcat', bearcat);
//                     callback(null);
//                 });
//             }
//         ], function (err) {
//             if (err) {
//                 done(err);
//                 return;
//             }
//             done();
//         });
//     });
//     describe('#post:/members/:memberID/check-member-permission\n' +
//         'input:{memberID:"",permissionID:""}\n' +
//         'output:{errcode:0,errmsg:"",isSuccess:""}', function () {
//         context('request for check member permission', function () {
//             it('should response message with errcode:FAIL if no a such lessee', function (done) {
//                 var memberID = "noMemberID";
//                 var body = {
//                     permissionID: "permissionID"
//                 };
//                 request(server)
//                     .post(`/members/${memberID}/check-member-permission`)
//                     .send(body)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end(function (err, res) {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
//                         done();
//                     });
//             });
//             it('should response message with errcode:FAIL if no a such permission', function (done) {
//                 var memberID = "memberID";
//                 var body = {
//                     permissionID: "noPermissionID"
//                 };
//                 request(server)
//                     .post(`/members/${memberID}/check-member-permission`)
//                     .send(body)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end(function (err, res) {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
//                         done();
//                     });
//             });
//             it('should response message with errcode:OK and isSuccess:true if success', function (done) {
//                 var memberID = "memberID";
//                 var body = {
//                     permissionID: "permissionID"
//                 };
//                 request(server)
//                     .post(`/members/${memberID}/check-member-permission`)
//                     .send(body)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end(function (err, res) {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
//                         res.body.isSuccess.should.be.eql(true);
//                         done();
//                     });
//             });
//         });
//     });
//     describe('#post:/members/:memberID/auth-member\n' +
//         'input:{memberID:""}\n' +
//         'output:{errcode:0,errmsg:"",stationID:""}', function () {
//         context('request for auth member', function () {
//             it('should response message with errcode:FAIL if no a such member', function (done) {
//                 var memberID = "noMemberID";
//                 var body = {};
//                 request(server)
//                     .post(`/members/${memberID}/auth-member`)
//                     .send(body)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end(function (err, res) {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
//                         done();
//                     });
//             });
//             it('should response message with errcode:OK and stationID if success', function (done) {
//                 var memberID = "memberID";
//                 var body = {};
//                 request(server)
//                     .post(`/members/${memberID}/auth-member`)
//                     .send(body)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end(function (err, res) {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
//                         res.body.memberData.memberID.should.be.eql("memberID");
//                         done();
//                     });
//             });
//         });
//     });
//     after(function (done) {
//         async.parallel([
//             function (callback) {
//                 server.close(callback);
//             }], function (err, results) {
//             if (err) {
//                 done(err);
//                 return;
//             }
//             done();
//         });
//     });
// });