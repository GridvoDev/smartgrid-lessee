'use strict';

class Role {
    constructor({roleID, roleName, permissions}) {
        this._roleID = roleID;
        this._roleName = roleName;
        this._permissions = permissions ? permissions : [];
    }

    get roleID() {
        return this._roleID;
    }

    get roleName() {
        return this._roleName;
    }

    get permissions() {
        return this._permissions;
    }

    addPermission(permissionID) {
        this._permissions.push(permissionID);
    }

    removePermission(permissionID) {
        this._permissions.splice(permissionID);
    }
}

module.exports = Role;