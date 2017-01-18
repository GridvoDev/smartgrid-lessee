'use strict';

var Permission = require('../../../../lib/domain/roleAndPermission/permission.js');

function Repository() {
}

Repository.prototype.savePermission = function (permission, callback) {
    callback(null,true);
};


Repository.prototype.getAllPermission = function (callback) {
    var permissions = [];
    var permission = {};
    permission.permissionID = "permissionID";
    permission.permissionName = "permissionName";
    permission = new Permission(permission);
    permissions.push(permission);
    callback(null, permissions);
};
Repository.prototype.getPermissionsByIDs = function (permissionIDs, callback) {
    var permissions = [];
    var permission = {};
    for (var permissionID of permissionIDs) {
        permission.permissionID = permissionID;
        permission.permissionName = "permissionName";
        permission = new Permission(permission);
        permissions.push(permission);
    }
    callback(null, permissions);
};
Repository.prototype.delPermissionByID = function (permissionID, callback) {
    if (permissionID == "noPermissionID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};

module.exports = Repository;