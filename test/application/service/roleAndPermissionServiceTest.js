'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const RoleAndPermissionService = require('../../../lib/application/service/roleAndPermissionService');

describe('roleAndPermission service use case test', function () {
    var service;

    before(()=> {
        service = new RoleAndPermissionService();
    });
    describe('#registerPermission(permissionData, traceContext,callback)//callback(err,isSuccess)', function () {
        context('register and save permission data', function () {
            it('fail if no permissionData', (done)=> {
                let permissionData = null;
                service.registerPermission(permissionData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if permission data is illegal', (done)=> {
                let permissionData = {};
                permissionData.permissionID = null;
                service.registerPermission(permissionData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', (done)=> {
                let permissionData = {};
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
    describe('#getPermissions(traceContext, callback)//callback(err,permissions)', function () {
        context('obtain all permission', function () {
            it('success', (done)=> {
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
    describe('#registerRole(roleData, traceContext,callback)//callback(err,isSuccess)', function () {
        context('register and save role data', function () {
            it('fail if no roleData', (done)=> {
                var roleData = null;
                service.registerRole(roleData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if roleData is illegal', (done)=> {
                var roleData = {};
                roleData.roleID = null;
                service.registerRole(roleData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', (done)=> {
                var roleData = {};
                roleData.roleID = "roleID";
                roleData.roleName = "roleName";
                roleData.permissionIDs = [{
                    permissionID: "permissionID"
                }];
                service.registerRole(roleData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getRoles(traceContext, callback)//callback(err,roles)', function () {
        context('obtain all role', function () {
            it('success', (done)=> {
                service.getRoles({}, (err, roles)=> {
                    roles.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#getRole(roleID, traceContext, callback)//callback(err,role)', ()=> {
        context('get permission by id', ()=> {
            it('should return null if no exits such role', done=> {
                let roleID = "noRoleID";
                service.getRole(roleID, {}, (err, role)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(role).should.be.eql(true);
                    done();
                });
            });
            it('should return a role if success', done=> {
                let roleID = "roleID";
                service.getRole(roleID, {}, (err, role)=> {
                    if (err) {
                        done(err);
                    }
                    role.roleID.should.be.eql(roleID);
                    done();
                });
            });
        });
    });
    describe('#assignPermissionToRole(permissionID, roleID, traceContext, callback)//callback(err,isSuccess)', function () {
        context('assign permissions to one role', function () {
            it('fail if no exits such permissions', (done)=> {
                let permissionID = null;
                let roleID = "roleID";
                service.assignPermissionToRole(permissionID, roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such role', (done)=> {
                let permissionID = "permissionID";
                let roleID = "noRoleID";
                service.assignPermissionToRole(permissionID, roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', (done)=> {
                let permissionID = "permissionID";
                let roleID = "roleID";
                service.assignPermissionToRole(permissionID, roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#canclePermissionofRole(permissionID, roleID, traceContext, callback)//callback(err,isSuccess)', function () {
        context('cancle permission to one role', function () {
            it('fail if no exits such permissions', (done)=> {
                var permissionID = null;
                var roleID = "roleID";
                service.canclePermissionofRole(permissionID, roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such role', (done)=> {
                var permissionID = "permissionID";
                var roleID = "noRoleID";
                service.canclePermissionofRole(permissionID, roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', (done)=> {
                var permissionID = "permissionID";
                var roleID = "roleID";
                service.canclePermissionofRole(permissionID, roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#delPermission(permissionID, traceContext, callback)//callback(err,isSuccess)', function () {
        context('remove an permission of id', function () {
            it('should return null if no this permission', (done)=> {
                var permissionID = "noPermissionID";
                service.delPermission(permissionID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return true if del one station', (done)=> {
                var permissionID = "permissionID";
                service.delPermission(permissionID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#delRole(roleID, traceContext, callback)//callback(err,isSuccess)', function () {
        context('remove an permission of id', function () {
            it('should return null if no this permission', (done)=> {
                let roleID = "noRoleID";
                service.delRole(roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return true if del one station', (done)=> {
                let roleID = "roleID";
                service.delRole(roleID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
});