'use strict';

class Role {
    constructor({roleID, roleName, permissionID}) {
        this._roleID = roleID;
        this._roleName = roleName;
        this._permissionID = permissionID;
    }

    get roleID() {
        return this._roleID;
    }

    get roleName() {
        return this._roleName;
    }

    get permissionID() {
        return this._permissionID;
    }

    addPermission(permissionID) {
        this._permissionID.push(permissionID);
    }

    removePermission(permissionID) {
        this._permissionID.splice(permissionID);
    }
}

module.exports = Role;