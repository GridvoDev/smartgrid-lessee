'use strict';
const co = require('co');
const _ = require('underscore');
const async = require('async');
const {Permission} = require('../../domain/roleAndPermission');
const {createPermissionRepository} = require('../../infrastructure');
const {logger} = require('../../util');

class Service {
    constructor() {
        this._permissionRepository = createPermissionRepository();
    }

    registerPermission(permissionData, traceContext, callback) {
        if (!permissionData || !permissionData.permissionID || !permissionData.permissionName) {
            callback(null, false);
            return;
        }
        let self = this;

        function getPermissionFromRepository() {
            return new Promise((resolve, reject) => {
                self._permissionRepository.getPermissionByID(permissionData.permissionID, traceContext, (err, permission) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(permission);
                });
            });
        }

        function savePermission(permission) {
            return new Promise((resolve, reject) => {
                self._permissionRepository.savePermission(permission, traceContext, (err, isSuccess) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* registerPermission() {
            let lessee = yield getPermissionFromRepository();
            if (lessee) {
                logger.error("this permission exist", traceContext);
                return false;
            }
            let newPermission = {};
            newPermission.permissionID = permissionData.permissionID;
            newPermission.permissionName = permissionData.permissionName;
            newPermission = new Permission(newPermission);
            let isSuccess = yield savePermission(newPermission);
            return isSuccess
        };
        co(registerPermission).then((isSuccess) => {
            callback(null, isSuccess);
        }).catch(err => {
            callback(err);
        });
    };

    getPermissions(traceContext, callback) {
        let self = this
        self._permissionRepository.getAllPermission(traceContext, (err, result) => {
            if (err) {
                logger.error("this permissions no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!result){
                callback(null, null);
            }
            let permissions = [];
            for (let permission of result) {
                let {permissionID, permissionName} = permission;
                permissions.push({permissionID, permissionName});
            }
            callback(null, permissions);
        });
    };

    getPermission(permissionID, traceContext, callback) {
        let self = this
        self._permissionRepository.getPermissionByID(permissionID, traceContext, (err, permission) => {
            if (err) {
                logger.error("this permission no exist", traceContext);
                callback(err, null);
                return;
            }
            if(!permission){
                callback(null, null);
            }
            callback(null, permission);
        });
    }

    delPermission(permissionID, traceContext, callback) {
        if (!permissionID) {
            callback(null, false);
            return;
        }
        var self = this;
        self._permissionRepository.delPermissionByID(permissionID, traceContext, (err, isSuccess) => {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    };

    obtainAllRole(callback) {
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
            }
            ;
            callback(null, roleDatas);
        });
    };

    assignPermissionsToRole(permissionIDs, roleID, callback) {
        if (!permissionIDs || !roleID) {
            callback(null, false);
            return;
        }
        var self = this;
        var _permissions;
        async.waterfall([
            function (cb) {
                self._permissionRepository.getPermissionsByIDs(permissionIDs, cb);
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

    canclePermissionsofRole(permissionIDs, roleID, callback) {
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
}

module.exports = Service;
