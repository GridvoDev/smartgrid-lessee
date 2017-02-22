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
                app.use('/', roleAndPermissionRouter);
                let mockRoleAndPermissionService = {};
                mockRoleAndPermissionService.registerPermission = function (permissionData, traceContext, callback) {
                    if (!permissionData || !permissionData.permissionID || !permissionData.permissionName) {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                mockRoleAndPermissionService.getPermissions = function (traceContext, callback) {
                    callback(null, {});
                };
                mockRoleAndPermissionService.getPermission = function (permissionID, traceContext, callback) {
                    if (!permissionID || permissionID == "noPermissionID") {
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
                mockRoleAndPermissionService.registerRole = function (roleData, traceContext, callback) {
                    if (!roleData || !roleData.roleID || !roleData.roleName || !roleData.permissionID) {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                mockRoleAndPermissionService.getRoles = function (traceContext, callback) {
                    callback(null, {});
                };
                mockRoleAndPermissionService.getRole = function (roleID, traceContext, callback) {
                    if (!roleID || roleID == "noRoleID") {
                        callback(null, null);
                        return;
                    }
                    callback(null, {});
                };
                mockRoleAndPermissionService.delRole = function (roleID, traceContext, callback) {
                    if (!roleID || roleID == "noRoleID") {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                mockRoleAndPermissionService.assignPermissionToRole = function (permissionID, roleID, traceContext, callback) {
                    if (!roleID || !permissionID || roleID == "noRoleID" || permissionID == "noPermissionID") {
                        callback(null, false);
                        return;
                    }
                    callback(null, true);
                };
                mockRoleAndPermissionService.canclePermissionofRole = function (permissionID, roleID, traceContext, callback) {
                    if (!roleID || !permissionID || roleID == "noRoleID" || permissionID == "noPermissionID") {
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
                let body = {};
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
            it('should response message with errcode:OK if success', (done)=> {
                let body = {
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
    describe('#get:/permissions/:permissionID\n' +
        'input:{permissionID:""}\n' +
        'output:{errcode:0,errmsg:"",permission:""}', ()=> {
        context('request for get permission', ()=> {
            it('should response message with errcode:FAIL if no a such permission', (done)=> {
                let permissionID = "noPermissionID";
                request(server)
                    .get(`/permissions/${permissionID}`)
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
            it('should response message with errcode:OK and permission if success', (done)=> {
                let permissionID = "permissionID";
                request(server)
                    .get(`/permissions/${permissionID}`)
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
        'output:{errcode:0,errmsg:"",permissions:""}', ()=> {
        context('request for get all permissions', ()=> {
            it('should response message with errcode:OK and permissions if success', (done)=> {
                request(server)
                    .get(`/permissions`)
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
    describe('#post:/roles\n' +
        'input:{roleID:"",roleName:"",permissionID:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for register a role', ()=> {
            it('should response message with errcode:FAIL if post body is illegal', (done)=> {
                let body = {};
                request(server)
                    .post(`/roles`)
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
            it('should response message with errcode:OK if success', (done)=> {
                let body = {
                    roleID: "roleID",
                    roleName: "roleName",
                    permissionID: "permissionID"
                };
                request(server)
                    .post(`/roles`)
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
    describe('#get:/roles/:roleID\n' +
        'input:{roleID:""}\n' +
        'output:{errcode:0,errmsg:"",role:""}', ()=> {
        context('request for get role', ()=> {
            it('should response message with errcode:FAIL if no a such role', (done)=> {
                let roleID = "noRoleID";
                request(server)
                    .get(`/roles/${roleID}`)
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
            it('should response message with errcode:OK and role if success', (done)=> {
                let roleID = "roleID";
                request(server)
                    .get(`/roles/${roleID}`)
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
    describe('#get:/roles\n' +
        'output:{errcode:0,errmsg:"",roles:""}', ()=> {
        context('request for get all roles', ()=> {
            it('should response message with errcode:OK and roles if success', (done)=> {
                request(server)
                    .get(`/roles`)
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
    describe('#post:/roles/:roleID/permissions\n' +
        'input:{permissionID: ""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for assign permission to role', ()=> {
            it('should response message with errcode:FAIL if no a such role', (done)=> {
                let roleID = "noRoleID";
                let body = {
                    permissionID: "permissionID"
                };
                request(server)
                    .post(`/roles/${roleID}/permissions`)
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
            it('should response message with errcode:FAIL if no a such permission', (done)=> {
                let roleID = "roleID";
                let body = {
                };
                request(server)
                    .post(`/roles/${roleID}/permissions`)
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
            it('should response message with errcode:OK and isSuccesss:true if success', (done)=> {
                let roleID = "roleID";
                let body = {
                    permissionID: "permissionID"
                };
                request(server)
                    .post(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
                        done();
                    });
            });
        });
    });
    describe('#delete:/roles/:roleID/permissions\n' +
        'input:{permissionID: ""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for cancle permission of role', ()=> {
            it('should response message with errcode:FAIL if no a such role', (done)=> {
                let roleID = "noRoleID";
                let body = {
                    permissionID: "permissionID"
                };
                request(server)
                    .del(`/roles/${roleID}/permissions`)
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
            it('should response message with errcode:FAIL if no a such permission', (done)=> {
                let roleID = "roleID";
                let body = {
                };
                request(server)
                    .del(`/roles/${roleID}/permissions`)
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
            it('should response message with errcode:OK and isSuccesss:true if success', (done)=> {
                let roleID = "roleID";
                let body = {
                    permissionID: "permissionID"
                };
                request(server)
                    .del(`/roles/${roleID}/permissions`)
                    .send(body)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res)=> {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(errCodeTable.OK.errCode);
                        res.body.isSuccess.should.be.eql(true);
                        done();
                    });
            });
        });
    });
    describe('#delete:/permissions/:permissionID\n' +
        'input:{permissionID:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for delete a permission', ()=> {
            it('should response message with errcode:FAIL if no a such permission', (done)=> {
                let permissionID = "noPermissionID";
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
                let permissionID = "permissionID";
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
    describe('#delete:/roles/:roleID\n' +
        'input:{roleID:""}\n' +
        'output:{errcode:0,errmsg:"",isSuccess:""}', ()=> {
        context('request for delete a role', ()=> {
            it('should response message with errcode:FAIL if no a such role', (done)=> {
                let roleID = "noRoleID";
                request(server)
                    .del(`/roles/${roleID}`)
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
                let roleID = "roleID";
                request(server)
                    .del(`/roles/${roleID}`)
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