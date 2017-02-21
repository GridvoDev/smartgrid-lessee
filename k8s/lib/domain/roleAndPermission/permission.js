'use strict';

class Permission{
    constructor({permissionID, permissionName}) {
        this._permissionID = permissionID;
        this._permissionName = permissionName;
    }
    get permissionID() {
        return this._permissionID;
    }
    get permissionName(){
        return this._permissionName;
    }
}

module.exports = Permission;