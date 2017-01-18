'use strict';

class Role{
    constructor({roleID, roleName, permissions}) {
        this._roleID = roleID;
        this._roleName = roleName;
        this._permissions = permissions ? permissions : [];
    }
    get roleID() {
        return this._roleID;
    }
    get roleName(){
        return this._roleName;
    }
    get permissions(){
        return this._permissions;
    }
    addPermissions (permissions) {
        let flag = 0;
        for (var permission of permissions) {
            for (var _permission of this.permissions) {
                if(_permission.permissionID == permission.permissionID){
                    flag = 1;
                }
            }
            if(flag == 0){
                this._permissions.push(permission);
            }
        }
    }
    removePermissions (permissionIDs) {
        for (var permissionID of permissionIDs) {
            var index = 0;
            for (var permission of this._permissions) {
                if(permission.permissionID == permissionID){
                    this._permissions.splice(index, 1);
                }
                index++;
            }
        }
    }
}

module.exports = Role;