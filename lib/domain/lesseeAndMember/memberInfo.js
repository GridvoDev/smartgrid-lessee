'use strict';

class MemberInfo{
    constructor(memberData) {
        this._memberName = memberData.memberName;
    }
    get memberName(){
        return this._memberName;
    }
}

module.exports = MemberInfo;