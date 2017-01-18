'use strict';

class Member{
    constructor({memberID, memberInfo, lesseeID, roles, state}) {
        this._memberID = memberID;
        this._memberInfo = memberInfo;
        this._lesseeID = lesseeID;
        this._roles = roles ? roles : [];
        this._state = state ? state : [];
    }
    get memberID(){
        return this._memberID;
    }
    get memberInfo(){
        return this._memberInfo;
    }
    get lesseeID(){
        return this._lesseeID;
    }
    get roles(){
        return this._roles;
    }
    get state(){
        return this._state;
    }
    hadPermission(permissionID) {
        for (var role of this.roles) {
            for (var permission of role.permissions) {
                if(permissionID == permission.permissionID){
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = Member;