'use strict';
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');
var util = require('util');
var request = require('request');
var Permission = require('../../domain/roleAndPermission/permission.js');
var Role = require('../../domain/roleAndPermission/role.js');
var constants = require('../util/index');

function Service() {
    EventEmitter.call(this);
    this.httpUrl = "";//TODO httpUrl 随意定的
    this.__httpRequest__ = request;
    this.__permissionRepository__ = null;
    this.__roleRepository__ = null;
}
util.inherits(Service, EventEmitter);

Service.prototype.registerPermission = function (permissionData, callback) {
    if (!permissionData || !permissionData.permissionID || !permissionData.permissionName) {
        callback(null, null);
        return;
    }
    var permission = {};
    permission.permissionID = permissionData.permissionID;
    permission.permissionName = permissionData.permissionName;
    permission = new Permission(permission);
    this.__permissionRepository__.savePermission(permission, function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, permission.permissionID);
    });
};
Service.prototype.obtainAllPermission = function (callback) {
    this.__permissionRepository__.getAllPermission(function (err, permissions) {
        if (err) {
            callback(err, null);
            return;
        }
        var permissionDatas = [];
        var permissionData = {};
        for (var permission of permissions) {
            permissionData = {};
            permissionData.permissionID = permission.permissionID;
            permissionData.permissionName = permission.permissionName;
            permissionDatas.push(permissionData);
        }
        callback(null, permissionDatas);
    });
};
Service.prototype.removePermission = function (permissionID, callback) {
    if (!permissionID) {
        callback(null, false);
        return;
    }
    var self = this;
    async.waterfall([
        function (cb) {
            self.__permissionRepository__.delPermissionByID(permissionID, cb);
        }
    ], function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};
Service.prototype.obtainAllRole = function (callback) {
    var service = this;
    var wechattaglist;
    async.waterfall([function (cb) {
        var url = service.httpUrl;
        var options = {
            method: "GET",
            url: url,
            json: true
        };
        service.__httpRequest__(options, cb);
    }, function (response, body, cb) {
        if (!body || body.errcode != 0) {
            callback(null, null);
            return;
        }
        wechattaglist = body.taglist;
        /**
         *  taglist: [
         *      { tagID: , tagName: },
         *      ...
         *  ]
         */
        var roleDatas = [];
        var role;
        for (var tag of wechattaglist) {
            var roleData = {};
            roleData.roleID = tag.tagID;
            roleData.roleName = tag.tagName;
            roleData.permissions = [];
            role = new Role(roleData);
            service.__roleRepository__.saveRole(role, function () {
                roleDatas.push(role);
            });
        }
        cb(null, roleDatas);
    }], function (err, roleDatas) {
        if (err) {
            callback(err, null);
            return;
        };
        callback(null, roleDatas);
    });
};
Service.prototype.assignPermissionsToRole = function (permissionIDs, roleID, callback) {
    if (!permissionIDs || !roleID) {
        callback(null, false);
        return;
    }
    var self = this;
    var _permissions;
    async.waterfall([
        function (cb) {
            self.__permissionRepository__.getPermissionsByIDs(permissionIDs, cb);
        },
        function (permissions, cb) {
            if (!permissions) {
                callback(null, false);
                return;
            }
            _permissions = permissions;
            self.__roleRepository__.getRoleByID(roleID, cb);
        },
        function (role, cb) {
            if (!role) {
                callback(null, false);
                return;
            }
            role.addPermissions(_permissions);
            self.__roleRepository__.saveRole(role, cb);
        }
    ], function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};
Service.prototype.canclePermissionsofRole = function (permissionIDs, roleID, callback) {
    if (!permissionIDs || !roleID) {
        callback(null, false);
        return;
    }
    var self = this;
    async.waterfall([
        function (cb) {
            self.__roleRepository__.getRoleByID(roleID, cb);
        },
        function (role, cb) {
            if (!role) {
                callback(null, false);
                return;
            }
            role.removePermissions(permissionIDs);
            self.__roleRepository__.saveRole(role, cb);
        }
    ], function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};

module.exports = Service;
