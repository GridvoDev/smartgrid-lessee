const _ = require('underscore');
const co = require('co');
const async = require('async');
const should = require('should');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const lesseeRouter = require('../../../lib/express/routes/lessee.js');
const errCodeTable = require('../../../lib/express/util/errCode.js');
const {expressZipkinMiddleware, createZipkinTracer} = require("gridvo-common-js");

describe('lessees route use case test', ()=> {
    let app;
    let server;
    before(done=> {
        function setupExpress() {
            return new Promise((resolve, reject)=> {
                app = express();
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({extended: false}));
                app.use(expressZipkinMiddleware({
                    tracer: createZipkinTracer({}),
                    serviceName: 'test-service'
                }));
                app.use('/', lesseeRouter);
                let mockLesseeService = {};
                mockLesseeService.registerLessee = function (lesseeData, traceContext, callback) {
                    if (!lesseeData || !lesseeData.lesseeID || !lesseeData.lesseeName) {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                }
                mockLesseeService.changeCorpWechatActiveState = function (corpID, isActived, traceContext, callback) {
                    if (!corpID || (isActived !== true && isActived !== false)) {
                        callback(null, false);
                        return;
                    }
                    if (corpID == "noCorpID") {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                mockLesseeService.addStationToLessee = function (lesseeID, stationData, traceContext, callback) {
                    if (!lesseeID || !stationData || !stationData.stationID || !stationData.stationName) {
                        callback(null, null);
                        return;
                    }
                    if (lesseeID == "noLesseeID") {
                        callback(null, null);
                        return;
                    }
                    callback(null, stationData.stationID);
                };
                mockLesseeService.delStationFromLessee = function (lesseeID, stationID, traceContext, callback) {
                    if (!lesseeID || !stationID) {
                        callback(null, false);
                        return;
                    }
                    if (lesseeID == "noLesseeID" || stationID == "noStationID") {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                app.set('lesseeService', mockLesseeService);
                server = app.listen(3001, err=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* setup() {
            yield setupExpress();
        };
        co(setup).then(()=> {
            done();
        }).catch(err=> {
            done(err);
        });
    });
    describe('#post:/lessees\n' +
        'input:{lesseeID:"",lesseeName:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for register a lessee', ()=> {
            it('should response message with errcode:Fail if post body is illegal', done=> {
                var body = {};
                request(server)
                    .post(`/lessees`)
                    .send(body)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        res.body.errmsg.should.be.eql("fail");
                        done();
                    });
            });
            it('should response message with errcode:OK and isSuccess:true if success', done=> {
                var body = {
                    lesseeID: "lesseeID",
                    lesseeName: "lesseeName"
                };
                request(server)
                    .post(`/lessees`)
                    .send(body)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.errmsg.should.be.eql("ok");
                        done();
                    });
            });
        });
    });
    describe('#post:/lessees/:lesseeID/stations\n' +
        'input:{stationID:"",stationName:""}\n' +
        'output:{errcode:0,errmsg:"",stationID:""}', ()=> {
        context('request for adding a station to the lessee', ()=> {
            it('should response message with errcode:Fail if post body is illegal', done=> {
                var lesseeID = "lesseeID";
                var body = {};
                request(server)
                    .post(`/lessees/${lesseeID}/stations`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:Fail if no a such lessee', done=> {
                var lesseeID = "noLesseeID";
                var body = {
                    stationID: "stationID",
                    stationName: "stationName"
                };
                request(server)
                    .post(`/lessees/${lesseeID}/stations`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:OK and stationID if success', done=> {
                var lesseeID = "lesseeID";
                var body = {
                    stationID: "stationID",
                    stationName: "stationName"
                };
                request(server)
                    .post(`/lessees/${lesseeID}/stations`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.stationID.should.be.eql("stationID");
                        done();
                    });
            });
        });
    });
    // describe('#post:/lessees/:lesseeID/stations/:stationID/members\n' +
    //     'input:{memberID: ""}\n' +
    //     'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
    //     context('request for assign member to lessee station', ()=> {
    //         it('should response message with errcode:Fail if no a such lessee', done=> {
    //             var lesseeID = "noLesseeID";
    //             var stationID = "stationID";
    //             var body = {
    //                 memberID: "memberID"
    //             };
    //             request(server)
    //                 .post(`/lessees/${lesseeID}/stations/${stationID}/members`)
    //                 .send(body)
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .end((err, res)=> {
    //                     if (err) {
    //                         done(err);
    //                         return;
    //                     }
    //                     res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
    //                     done();
    //                 });
    //         });
    //         it('should response message with errcode:Fail if no a such station', done=> {
    //             var lesseeID = "lesseeID";
    //             var stationID = "noStationID";
    //             var body = {
    //                 memberID: "memberID"
    //             };
    //             request(server)
    //                 .post(`/lessees/${lesseeID}/stations/${stationID}/members`)
    //                 .send(body)
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .end((err, res)=> {
    //                     if (err) {
    //                         done(err);
    //                         return;
    //                     }
    //                     res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
    //                     done();
    //                 });
    //         });
    //         it('should response message with errcode:OK and isSuccesss:true if success', done=> {
    //             var lesseeID = "lesseeID";
    //             var stationID = "stationID";
    //             var body = {
    //                 memberID: "memberID"
    //             };
    //             request(server)
    //                 .post(`/lessees/${lesseeID}/stations/${stationID}/members`)
    //                 .send(body)
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .end((err, res)=> {
    //                     if (err) {
    //                         done(err);
    //                         return;
    //                     }
    //                     res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
    //                     res.body.isSuccess.should.be.eql(true);
    //                     done();
    //                 });
    //         });
    //     });
    // });
    describe('#delete:/lessees/:lesseeID/stations/:stationID\n' +
        'input:{stationID:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for delete a station to the lessee', ()=> {
            it('should response message with errcode:Fail if no a such lessee', done=> {
                var lesseeID = "noLesseeID";
                var stationID = "stationID";
                request(server)
                    .del(`/lessees/${lesseeID}/stations/${stationID}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:Fail if no a such station', done=> {
                var lesseeID = "lesseeID";
                var stationID = "noStationID";
                request(server)
                    .del(`/lessees/${lesseeID}/stations/${stationID}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        done();
                    });
            });
            it('should response message with errcode:OK and isSuccess:true if success', done=> {
                var lesseeID = "lesseeID";
                var stationID = "stationID";
                request(server)
                    .del(`/lessees/${lesseeID}/stations/${stationID}`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        done();
                    });
            });
        });
    });
    describe('#post:/lessees/:corpID/change-wechat-active-state\n' +
        'input:{isActived: true}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for change lessee activeState', ()=> {
            it('should response message with errcode:Fail if no a such lessee', done=> {
                var corpID = "noCorpID";
                var body = {
                    isActived: true
                };
                request(server)
                    .post(`/lessees/${corpID}/change-wechat-active-state`)
                    .send(body)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.FAIL.errCode);
                        res.body.errmsg.should.be.eql("fail");
                        done();
                    });
            });
            it('should response message with errcode:OK and isSuccess:OK if success', done=> {
                var corpID = "corpID";
                var body = {
                    isActived: true
                };
                request(server)
                    .post(`/lessees/${corpID}/change-wechat-active-state`)
                    .send(body)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.errmsg.should.be.eql("ok");
                        done();
                    });
            });
        });
    });
    after(done=> {
        function teardownExpress() {
            return new Promise((resolve, reject)=> {
                server.close(err=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* teardown() {
            yield teardownExpress();
        };
        co(teardown).then(()=> {
            done();
        }).catch(err=> {
            done(err);
        });
    });
});