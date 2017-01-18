'use strict';

var Role = require('../../../../lib/domain/roleAndPermission/role.js');

function Repository() {
}

Repository.prototype.saveRole = function (role, callback) {
    callback(null, true);
};
Repository.prototype.getAllRole = function (callback) {
    var roles = [];
    var role = {};
    role.roleID = "roleID";
    role.roleName = "roleName";
    role.permissions = [];
    role = new Role(role);
    roles.push(role);
    callback(null, roles);
};
Repository.prototype.getRolesByIDs = function (roleIDs, callback) {
    var roles = [];
    for (var roleID of roleIDs) {
        var role = {};
        role.roleID = roleID;
        role.roleName = "roleName";
        role.permissions =  [{
            permissionID: "permissionID",
            permissionName: "permissionName"
        }];
        role = new Role(role);
        roles.push(role);
    }
    callback(null, roles);
};
Repository.prototype.getRoleByID = function (roleID, callback) {
    if (roleID == "noRoleID") {
        callback(null, null);
        return;
    }
    var role = {};
    role.roleID = roleID;
    role.permissions = [];
    role = new Role(role);
    callback(null, role);
};

module.exports = Repository;