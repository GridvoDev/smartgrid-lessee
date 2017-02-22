'use strict';

class Role {
    constructor({roleID, roleName, permissionIDs}) {
        this._roleID = roleID;
        this._roleName = roleName;
        this._permissionIDs = permissionIDs ? permissionIDs : [];
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
        for (let document of _permissionIDs) {
            if(permissionID == document){
                return false;
            }
        }
        this._permissionIDs.push(permissionID);
        return true;
    }

    removePermission(permissionID) {
        let flag = 0;
        for (let document of _permissionIDs) {
            if(permissionID == document){
                this._permissionIDs.splice(flag,1);
                return true;
            }
            flag++;
        }
        return false;
    }
}

module.exports = Role;