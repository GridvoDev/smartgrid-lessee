// const _ = require('underscore');
// const co = require('co');
// const async = require('async');
// const should = require('should');
// const request = require('supertest');
// const express = require('express');
// const bodyParser = require('body-parser');
// const dataSourceRouter = require('../../../lib/express/routes/dataSource');
// const errCodeTable = require('../../../lib/express/util/errCode.js');
// const {expressZipkinMiddleware, createZipkinTracer} = require("gridvo-common-js");
//
// describe('dataSource route use case test', ()=> {
//     let app;
//     let server;
//     before(done=> {
//         function setupExpress() {
//             return new Promise((resolve, reject)=> {
//                 app = express();
//                 app.use(bodyParser.json());
//                 app.use(bodyParser.urlencoded({extended: false}));
//                 app.use(expressZipkinMiddleware({
//                     tracer: createZipkinTracer({}),
//                     serviceName: 'test-service'
//                 }));
//                 app.use('/', dataSourceRouter);
//                 let mockDataSourceService = {};
//                 mockDataSourceService.registerDataSource = function (dataSource, traceContext, callback) {
//                     if (!dataSource || !dataSource.dataSourceID || !dataSource.lessee || !dataSource.station || !dataSource.dataSourceType) {
//                         callback(null, false);
//                         return;
//                     }
//                     callback(null, true);
//                 }
//                 mockDataSourceService.delDataSource = function (dataSourceID, traceContext, callback) {
//                     if (!dataSourceID || dataSourceID == "noDataSourceID") {
//                         callback(null, false);
//                         return;
//                     }
//                     callback(null, true);
//                 };
//                 mockDataSourceService.getDataSources = function (dataSourceID, traceContext, callback) {
//                     if (dataSourceID == "noDataSourceID") {
//                         callback(null, null);
//                         return;
//                     }
//                     callback(null, []);
//                 };
//                 app.set('dataSourceService', mockDataSourceService);
//                 server = app.listen(3001, err=> {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 });
//             });
//         };
//         function* setup() {
//             yield setupExpress();
//         };
//         co(setup).then(()=> {
//             done();
//         }).catch(err=> {
//             done(err);
//         });
//     });
//     describe('#post:/dataSources\n' +
//         'input:{dataSourceID:""}\n' +
//         'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
//         context('request for register a dataSource', ()=> {
//             it('should response message with errcode:Fail if post body is illegal', done=> {
//                 var body = {};
//                 request(server)
//                     .post(`/dataSources`)
//                     .send(body)
//                     .set('Accept', 'application/json')
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end((err, res)=> {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
//                         res.body.errmsg.should.be.eql("fail");
//                         done();
//                     });
//             });
//             it('should response message with errcode:OK and isSuccess:true if success', done=> {
//                 var body = {
//                     dataSourceID: "station-datatype-other",
//                     dataSourceType: "dataSourceType",
//                     station: "stationID",
//                     lessee: "lesseeID"
//                 };
//                 request(server)
//                     .post(`/dataSources`)
//                     .send(body)
//                     .set('Accept', 'application/json')
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end((err, res)=> {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
//                         res.body.errmsg.should.be.eql("ok");
//                         done();
//                     });
//             });
//         });
//     });
//     describe('#get:/dataSources\n' +
//         'input:{dataSourceID:""}\n' +
//         'output:{errcode:0,errmsg:"",datas:""}', ()=> {
//         context('request for get lessee', ()=> {
//             it('should response message with errcode:Fail if post body is illegal', done=> {
//                 request(server)
//                     .get(`/dataSources?dataSourceID=noDataSourceID`)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end((err, res)=> {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
//                         done();
//                     });
//             });
//             it('should response message with errcode:ok', done=> {
//                 request(server)
//                     .get(`/dataSources?dataSourceID=`)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end((err, res)=> {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
//                         done();
//                     });
//             });
//             it('should response message with errcode:ok', done=> {
//                 request(server)
//                     .get(`/dataSources?dataSourceID=station-datatype-other`)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end((err, res)=> {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
//                         done();
//                     });
//             });
//         });
//     });
//     describe('#delete:/dataSources/:dataSourceID\n' +
//         'input:{dataSourceID:""}\n' +
//         'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
//         context('request for delete a lessee', ()=> {
//             it('should response message with errcode:Fail if no a such dataSource', done=> {
//                 var dataSourceID = "noDataSourceID";
//                 request(server)
//                     .del(`/dataSources/${dataSourceID}`)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end((err, res)=> {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
//                         done();
//                     });
//             });
//             it('should response message with errcode:OK and isSuccess:true if success', done=> {
//                 var dataSourceID = "station-datatype-other";
//                 request(server)
//                     .del(`/dataSources/${dataSourceID}`)
//                     .expect(200)
//                     .expect('Content-Type', /json/)
//                     .end((err, res)=> {
//                         if (err) {
//                             done(err);
//                             return;
//                         }
//                         res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
//                         done();
//                     });
//             });
//         });
//     });
//     after(done=> {
//         function teardownExpress() {
//             return new Promise((resolve, reject)=> {
//                 server.close(err=> {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 });
//             });
//         };
//         function* teardown() {
//             yield teardownExpress();
//         };
//         co(teardown).then(()=> {
//             done();
//         }).catch(err=> {
//             done(err);
//         });
//     });
// });