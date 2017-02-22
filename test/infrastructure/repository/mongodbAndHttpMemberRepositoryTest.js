// 'use strict';
// const _ = require('underscore');
// const async = require('async');
// const muk = require('muk');
// const MongoClient = require('mongodb').MongoClient;
// const should = require('should');
// const {Member, MemberInfo} = require('../../../lib/domain/lesseeAndMember');
// const MongodbAndHttpMemberRepository = require('../../../lib/infrastructure/repository/mongodbAndHttpMemberRepository');
//
// describe('member repository MongoDB and http use case test', () => {
//     let repository;
//     before(() => {
//         repository = new MongodbAndHttpMemberRepository();
//     });
//     describe('#getMemberByID(memberID, traceContext, callback)//callback(err,member)', () => {
//         context('get an member for id', () => {
//             it('should return null if no this member', (done) => {
//                 let memberID = "noMemberID";
//                 repository.getMemberByID(memberID, {}, (err, memberJSON) => {
//                     _.isNull(memberJSON).should.be.eql(true);
//                     done();
//                 });
//             });
//             it('should return member if http is ok', (done) => {
//                 let mockRequest = function (options, callback) {
//                     callback(null, {
//                         corpID: "corpID",
//                         userID: "userID",
//                         userName: "userName",
//                         status: 1
//                     });
//                 };
//                 muk(repository, "__httpRequest__", mockRequest);
//                 let memberID = "memberID";
//                 repository.getMemberByID(memberID, {}, (err, memberJSON) => {
//                     memberJSON.memberID.should.be.eql("userID");
//                     memberJSON.memberInfo.memberName.should.be.eql("username");
//                     memberJSON.lesseeID.should.be.eql("corpID");
//                     memberJSON.state.should.be.eql(1);
//                     done();
//                 });
//             });
//         });
//     });
//     after((done) => {
//         let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
//         MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Member`, (err, db)=> {
//             if (err) {
//                 done(err);
//                 return;
//             }
//             db.collection('MemberInfo').drop((err, response)=> {
//                 db.close();
//                 done();
//             });
//         });
//     });
// });
