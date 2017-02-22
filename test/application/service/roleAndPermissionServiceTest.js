'use strict';
const _ = require('underscore');
const should = require('should');
const RoleAndPermissionService = require('../../../lib/application/service/roleAndPermissionService');

describe('roleAndPermission service use case test', function () {
    var service;

    before(()=> {
        service = new RoleAndPermissionService();
    });
    describe('#registerPermission(permissionData, traceContext,callback)//callback(err,isSuccess)', function () {
        context('register and save permission data', function () {
            it('fail if no permissionData', function (done) {
                var permissionData = null;
                service.registerPermission(permissionData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if permission data is illegal', function (done) {
                var permissionData = {};
                permissionData.permissionID = null;
                service.registerPermission(permissionData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', function (done) {
                var permissionData = {};
                permissionData.permissionID = "permissionID";
                permissionData.permissionName = "permissionName";
                service.registerPermission(permissionData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getPermissions(traceContext, callback)//callback(err,permissionDatas)', function () {
        context('obtain all permission', function () {
            it('success', function (done) {
                service.getPermissions({}, (err, permissions)=> {
                    permissions.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#getPermission(permissionID, traceContext, callback)//callback(err,permission)', ()=> {
        context('get permission by id', ()=> {
            it('should return null if no exits such permission', done=> {
                let permissionID = "noPermissionID";
                service.getPermission(permissionID, {}, (err, permission)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(permission).should.be.eql(true);
                    done();
                });
            });
            it('should return a permission if success', done=> {
                let permissionID = "permissionID";
                service.getPermission(permissionID, {}, (err, permission)=> {
                    if (err) {
                        done(err);
                    }
                    permission.permissionID.should.be.eql(permissionID);
                    done();
                });
            });
        });
    });
    describe('#delPermission(permissionID, traceContext, callback)//callback(err,isSuccess)', function () {
        context('remove an permission of id', function () {
            it('should return null if no this permission', function (done) {
                var permissionID = "noPermissionID";
                service.delPermission(permissionID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return true if del one station', function (done) {
                var permissionID = "permissionID";
                service.delPermission(permissionID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    // describe('#assignPermissionsToRole(permissionIDs, roleID, callback)//callback(err,isSuccess)', function () {
    //     context('assign permissions to one role', function () {
    //         it('fail if no exits such permissions', function (done) {
    //             var permissionIDs = null;
    //             var roleID = "roleID";
    //             service.assignPermissionsToRole(permissionIDs, roleID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('fail if no exits such role', function (done) {
    //             var permissionIDs = ["permissionID"];
    //             var roleID = "noRoleID";
    //             service.assignPermissionsToRole(permissionIDs, roleID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('success', function (done) {
    //             var permissionIDs = ["permissionID"];
    //             var roleID = "roleID";
    //             service.assignPermissionsToRole(permissionIDs, roleID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(true);
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('#canclePermissionsofRole(permissionIDs, roleID, callback)//callback(err,isSuccess)', function () {
    //     context('cancle permissions to one role', function () {
    //         it('fail if no exits such permissions', function (done) {
    //             var permissionIDs = null;
    //             var roleID = "roleID";
    //             service.canclePermissionsofRole(permissionIDs, roleID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('fail if no exits such role', function (done) {
    //             var permissionIDs = ["permissionID"];
    //             var roleID = "noRoleID";
    //             service.canclePermissionsofRole(permissionIDs, roleID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('success', function (done) {
    //             var permissionIDs = ["permissionID"];
    //             var roleID = "roleID";
    //             service.canclePermissionsofRole(permissionIDs, roleID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(true);
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('#obtainAllRole(callback)//callback(err,roleDatas)', function () {
    //     context('obtain all role', function () {
    //         it('success', function (done) {
    //             var mockRequest = function (options, callback) {
    //                 callback(null, {}, {
    //                     errcode: 0,
    //                     errcodemsg: "ok",
    //                     taglist: [{
    //                         tagID: 'tagsID1',
    //                         tagName: "tagsName1"
    //                     }, {
    //                         tagID: 'tagsID2',
    //                         tagName: "tagsName2"
    //                     }]
    //                 });
    //             };
    //             muk(service, "__httpRequest__", mockRequest);
    //             service.obtainAllRole(function (err, roleDatas) {
    //                 roleDatas.length.should.be.eql(2);
    //                 done();
    //             });
    //         });
    //         after(function () {
    //             muk.restore();
    //         });
    //     });
    // });
});