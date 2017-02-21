'use strict';

var AuthService = require('../../../../lib/application/service/authService.js');

function Service() {
}

Service.prototype.checkMemberPermission = function (memberID, permissionID, callback) {
    if (!memberID || !permissionID || memberID == "noMemberID" || permissionID == "noPermissionID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Service.prototype.authMember = function (memberID, callback) {
    if (!memberID || memberID == "noMemberID") {
        callback(null, null);
        return;
    }
    var memberData = {};
    memberData.memberID = memberID;
    memberData.memberName = "memberName";
    callback(null, memberData);
};

module.exports = Service;
