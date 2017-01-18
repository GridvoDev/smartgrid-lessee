'use strict';

var Member = require('../../../../lib/domain/lesseeAndMember/member.js');
var MemberInfo = require('../../../../lib/domain/lesseeAndMember/memberInfo.js');

function Repository() {
}

Repository.prototype.getMemberByID = function (memberID, callback) {
    if (memberID == "noMemberID") {
        callback(null, null);
        return;
    }
    var member = {};
    member.memberID = "memberID";
    member.memberInfo = new MemberInfo({memberName: "memberName"});
    member.lesseeID = "lesseeID";
    member.roles = [{
        roleID: "roleID",
        roleName: "roleName",
        permissions: [{
            permissionID: "permissionID",
            permissionName: "permissionName"
        }]
    }];
    member = new Member(member);
    callback(null, member);
};

module.exports = Repository;