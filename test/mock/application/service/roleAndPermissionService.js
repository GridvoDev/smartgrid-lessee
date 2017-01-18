'use strict';

var roleAndPermissionService = require('../../../../lib/application/service/roleAndPermissionService.js');
var Permission = require('../../../../lib/domain/roleAndPermission/permission.js');
var Role = require('../../../../lib/domain/roleAndPermission/role.js');

function Service() {
}

Service.prototype.registerPermission = function (permissionData, callback) {
    if (!permissionData || !permissionData.permissionID || !permissionData.permissionName) {
        callback(null, null);
        return;
    }
    callback(null, permissionData.permissionID);
};
Service.prototype.obtainAllPermission = function (callback) {
    var permissionDatas = [];
    var permission = {};
    permission.permissionID = "permissionID";
    permission.permissionName = "permissionName";
    permission = new Permission(permission);
    permissionDatas.push(permission);
    callback(null, permissionDatas);
};
Service.prototype.removePermission = function (permissionID, callback) {
    if (!permissionID || permissionID == "noPermissionID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Service.prototype.obtainAllRole = function (callback) {
    var roleDatas = [];
    var role = {};
    role.roleID = "roleID";
    role.roleName = "roleName";
    role.permissions = [];
    role = new Role(role);
    roleDatas.push(role);
    callback(null, roleDatas);
};
Service.prototype.assignPermissionsToRole = function (permissionIDs, roleID, callback) {
    if (!permissionIDs || !roleID || roleID == "noRoleID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Service.prototype.canclePermissionsofRole = function (permissionIDs, roleID, callback) {
    if (!permissionIDs || !roleID || roleID == "noRoleID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};

module.exports = Service;
