'use strict';
const co = require('co');
const _ = require('underscore');
const async = require('async');
const {Permission, Role} = require('../../domain/roleAndPermission');
const {createPermissionRepository, createRoleRepository} = require('../../infrastructure');
const {logger} = require('../../util');

class Service {
    constructor() {
        this._permissionRepository = createPermissionRepository();
        this._roleRepository = createRoleRepository();
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
            let permission = yield getPermissionFromRepository();
            if (permission) {
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
            if (!result) {
                callback(null, null);
            }
            let permissions = [];
            for (let permission of result) {
                permissions.push(permission);
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
            if (!permission) {
                callback(null, null);
            }
            let {permissionID, permissionName} = permission;
            callback(null, {permissionID, permissionName});
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

    registerRole(roleData, traceContext, callback) {
        if (!roleData || !roleData.roleID || !roleData.roleName) {
            callback(null, false);
            return;
        }
        let self = this;

        function getRoleFromRepository() {
            return new Promise((resolve, reject) => {
                self._roleRepository.getRoleByID(roleData.roleID, traceContext, (err, role) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(role);
                });
            });
        }

        function saveRole(role) {
            return new Promise((resolve, reject) => {
                self._roleRepository.saveRole(role, traceContext, (err, isSuccess) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* registerRole() {
            let role = yield getRoleFromRepository();
            if (role) {
                logger.error("this role exist", traceContext);
                return false;
            }
            let newRole = {};
            newRole.roleID = roleData.roleID;
            newRole.roleName = roleData.roleName;
            newRole = new Role(newRole);
            let isSuccess = yield saveRole(newRole);
            return isSuccess
        };
        co(registerRole).then((isSuccess) => {
            callback(null, isSuccess);
        }).catch(err => {
            callback(err);
        });
    };

    getRoles(traceContext, callback) {
        let self = this
        self._roleRepository.getRoles(traceContext, (err, result) => {
            if (err) {
                logger.error("this permissions no exist", traceContext);
                callback(err, null);
                return;
            }
            if (!result) {
                callback(null, null);
            }
            let roles = [];
            for (let role of result) {
                roles.push(role);
            }
            callback(null, roles);
        });
    };

    getRole(roleID, traceContext, callback) {
        let self = this
        self._roleRepository.getRoleByID(roleID, traceContext, (err, role) => {
            if (err) {
                logger.error("this permission no exist", traceContext);
                callback(err, null);
                return;
            }
            if (!role) {
                callback(null, null);
            }
            let {roleID, roleName, permissionIDs} = role;
            callback(null, {roleID, roleName, permissionIDs});
        });
    }

    delRole(roleID, traceContext, callback) {
        if (!roleID) {
            callback(null, false);
            return;
        }
        var self = this;
        self._roleRepository.delRoleByID(roleID, traceContext, (err, isSuccess) => {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    };

    assignPermissionToRole(permissionID, roleID, traceContext, callback) {
        if (!permissionID || !roleID) {
            callback(null, false);
            return;
        }
        var self = this;

        function getPermissionFromRepository() {
            return new Promise((resolve, reject) => {
                self._permissionRepository.getPermissionByID(permissionID, traceContext, (err, permission) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(permission);
                });
            });
        }

        function getRoleFromRepository(permission) {
            return new Promise((resolve, reject) => {
                self._roleRepository.getRoleByID(roleID, traceContext, (err, role) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(role);
                });
            });
        }

        function saveRole(role) {
            return new Promise((resolve, reject) => {
                self._roleRepository.saveRole(role, traceContext, (err, isSuccess) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* assignPermission() {
            let permission = yield getPermissionFromRepository();
            if (!permission) {
                logger.error("this permission no exist", traceContext);
                return false;
            }
            let role = yield getRoleFromRepository();
            if (!role) {
                logger.error("this role no exist", traceContext);
                return false;
            }
            role.addPermission(permission.permissionID);
            let isSuccess = yield saveRole(role);
            return isSuccess
        };
        co(assignPermission).then((isSuccess) => {
            callback(null, isSuccess);
        }).catch(err => {
            callback(err);
        });
    };

    canclePermissionofRole(permissionID, roleID, traceContext, callback) {
        if (!permissionID || !roleID) {
            callback(null, false);
            return;
        }
        var self = this;

        function getPermissionFromRepository() {
            return new Promise((resolve, reject) => {
                self._permissionRepository.getPermissionByID(permissionID, traceContext, (err, permission) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(permission);
                });
            });
        }

        function getRoleFromRepository(permission) {
            return new Promise((resolve, reject) => {
                self._roleRepository.getRoleByID(roleID, traceContext, (err, role) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(role);
                });
            });
        }

        function saveRole(role) {
            return new Promise((resolve, reject) => {
                self._roleRepository.saveRole(role, traceContext, (err, isSuccess) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* assignPermission() {
            let permission = yield getPermissionFromRepository();
            if (!permission) {
                logger.error("this permission no exist", traceContext);
                return false;
            }
            let role = yield getRoleFromRepository();
            if (!role) {
                logger.error("this role no exist", traceContext);
                return false;
            }
            role.removePermission(permission.permissionID);console.log(role);
            let isSuccess = yield saveRole(role);
            return isSuccess
        };
        co(assignPermission).then((isSuccess) => {
            callback(null, isSuccess);
        }).catch(err => {
            callback(err);
        });
    };
}

module.exports = Service;
