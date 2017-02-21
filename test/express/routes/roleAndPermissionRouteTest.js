const _ = require('underscore');
const co = require('co');
const async = require('async');
const should = require('should');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const roleAndPermissionRouter = require('../../../lib/express/routes/roleAndPermission');
const errCodeTable = require('../../../lib/express/util/errCode.js');
const {expressZipkinMiddleware, createZipkinTracer} = require("gridvo-common-js");

describe('roleAndPermission route use case test', ()=> {
    var app;
    var server;
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
                app.use('/', roleAndPermissionRouter);
                let mockRoleAndPermissionService = {};
                mockRoleAndPermissionService.registerPermission = function (permissionData, traceContext, callback) {
                    if (!permissionData || !permissionData.permissionID || !permissionData.permissionName) {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                mockRoleAndPermissionService.obtainAllPermission = function (traceContext, callback) {
                    callback(null, {});
                };
                mockRoleAndPermissionService.getPermission = function (permissionID, traceContext, callback) {
                    if (!permissionID) {
                        callback(null, null);
                        return;
                    }
                    callback(null, {});
                };
                mockRoleAndPermissionService.delPermission = function (permissionID, traceContext, callback) {
                    if (!permissionID || permissionID == "noPermissionID") {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                app.set('roleAndPermissionService', mockRoleAndPermissionService);
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
    describe('#post:/permissions\n' +
        'input:{permissionID:"",permissionName:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for register a permission', ()=> {
            it('should response message with errcode:FAIL if post body is illegal', (done)=> {
                var body = {};
                request(server)
                    .post(`/permissions`)
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
            it('should response message with errcode:OK and permissionID if success', (done)=> {
                var body = {
                    permissionID: "permissionID",
                    permissionName: "permissionName"
                };
                request(server)
                    .post(`/permissions`)
                    .send(body)
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
    describe('#get:/permissions\n' +
        'output:{errcode:0,errmsg:"",stationID:""}', ()=> {
        context('request for obtain permissions', ()=> {
            it('should response message with errcode:OK and permissionDatas if success', (done)=> {
                var body = {};
                request(server)
                    .get(`/permissions`)
                    .send(body)
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
            it('should response message with errcode:OK and permissionDatas if success', (done)=> {
                var body = {
                    permissionID: "permissionID"
                };
                request(server)
                    .get(`/permissions`)
                    .send(body)
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
    // describe('#post:/roles/:roleID/permissions\n' +
    //     'input:{permissionIDs: []}\n' +
    //     'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
    //     context('request for assign permission to role', ()=> {
    //         it('should response message with errcode:FAIL if no a such role', (done)=> {
    //             var roleID = "noRoleID";
    //             var body = {
    //                 permissionIDs: ["permissionID"]
    //             };
    //             request(server)
    //                 .post(`/roles/${roleID}/permissions`)
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
    //         it('should response message with errcode:FAIL if no a such permission', (done)=> {
    //             var roleID = "roleID";
    //             var body = {
    //                 permissionIDs: null
    //             };
    //             request(server)
    //                 .post(`/roles/${roleID}/permissions`)
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
    //         it('should response message with errcode:OK and isSuccesss:true if success', (done)=> {
    //             var roleID = "roleID";
    //             var body = {
    //                 permissionIDs: ["permissionID"]
    //             };
    //             request(server)
    //                 .post(`/roles/${roleID}/permissions`)
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
    // describe('#delete:/roles/:roleID/permissions\n' +
    //     'input:{permissionIDs: []}\n' +
    //     'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
    //     context('request for cancle permission of role', ()=> {
    //         it('should response message with errcode:FAIL if no a such role', (done)=> {
    //             var roleID = "noRoleID";
    //             var body = {
    //                 permissionIDs: ["permissionID"]
    //             };
    //             request(server)
    //                 .del(`/roles/${roleID}/permissions`)
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
    //         it('should response message with errcode:FAIL if no a such permission', (done)=> {
    //             var roleID = "roleID";
    //             var body = {
    //                 permissionIDs: null
    //             };
    //             request(server)
    //                 .del(`/roles/${roleID}/permissions`)
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
    //         it('should response message with errcode:OK and isSuccesss:true if success', (done)=> {
    //             var roleID = "roleID";//TODO permissions本身就是一个参数，也就是permissionIDs 要不要将URL改成`/roles/${roleID}/${permissions}`
    //             var body = {
    //                 permissionIDs: ["permissionID"]
    //             };
    //             request(server)
    //                 .del(`/roles/${roleID}/permissions`)
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
    // describe('#get:/roles\n' +
    //     'output:{errcode:0,errmsg:"",stationID:""}', ()=> {
    //     context('request for obtain roles', ()=> {
    //         it('should response message with errcode:OK and roleDatas if success', (done)=> {
    //             request(server)
    //                 .get(`/roles`)
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .end((err, res)=> {
    //                     if (err) {
    //                         done(err);
    //                         return;
    //                     }
    //                     res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
    //                     res.body.roleDatas.length.should.be.eql(1);
    //                     done();
    //                 });
    //         });
    //     });
    // });
    describe('#delete:/permissions/:permissionID\n' +
        'input:{permissionID:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for delete a permission', ()=> {
            it('should response message with errcode:FAIL if no a such permission', (done)=> {
                var permissionID = "noPermissionID";
                request(server)
                    .del(`/permissions/${permissionID}`)
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
            it('should response message with errcode:OK and isSuccess:true if success', (done)=> {
                var permissionID = "permissionID";
                request(server)
                    .del(`/permissions/${permissionID}`)
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
    // describe('#put:/lessees/:lesseeID\n' +
    //     'input:{isActived: true}\n' +
    //     'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
    //     context('request for change lessee activeState', ()=> {
    //         it('should response message with errcode:FAIL if no a such station', (done)=> {
    //             var lesseeID = "noLesseeID";
    //             var body = {
    //                 isActived: true
    //             };
    //             request(server)
    //                 .put(`/lessees/${lesseeID}`)
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
    //         it('should response message with errcode:OK and isSuccess:true if success', (done)=> {
    //             var lesseeID = "lesseeID";
    //             var body = {
    //                 isActived: true
    //             };
    //             request(server)
    //                 .put(`/lessees/${lesseeID}`)
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
    // after((done)=> {
    //     async.parallel([
    //         function (callback) {
    //             server.close(callback);
    //         }], function (err, results) {
    //         if (err) {
    //             done(err);
    //             return;
    //         }
    //         done();
    //     });
    // });
});