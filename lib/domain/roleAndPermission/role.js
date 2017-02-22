'use strict';

class Role {
    constructor({roleID, roleName, permissionIDs}) {
        this._roleID = roleID;
        this._roleName = roleName;
        this._permissionIDs = permissionIDs;
    }

    get roleID() {
        return this._roleID;
    }

    get roleName() {
        return this._roleName;
    }

    get permissionIDs() {
        return this._permissionIDs;
    }

    addPermission(permissionID) {
        this._permissionIDs.push(permissionID);
    }

    removePermission(permissionID) {
        this._permissionIDs.splice(permissionID);
    }
}

module.exports = Role;