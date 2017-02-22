'use strict';

class MemberInfo{
    constructor({memberName}) {
        this._memberName = memberName;
    }
    get memberName(){
        return this._memberName;
    }
}

module.exports = MemberInfo;