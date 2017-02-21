'use strict';

var LesseeService = require('../../../../lib/application/service/lesseeService.js');
var Station = require('../../../../lib/domain/lesseeAndMember/station.js');

function Service() {
}

Service.prototype.registerLessee = function (lesseeData, traceContext, callback) {
    if (!lesseeData || !lesseeData.lesseeID || !lesseeData.lesseeName) {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Service.prototype.changeLesseeWechatActiveState = function (lesseeID, isActived, traceContext, callback) {
    if (!lesseeID || (isActived !== true && isActived !== false)) {
        callback(null, false);
        return;
    }
    if (lesseeID == "noLesseeID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Service.prototype.addStationToLessee = function (lesseeID, stationData, traceContext, callback) {
    if (!lesseeID || !stationData || !stationData.stationID || !stationData.stationName) {
        callback(null, null);
        return;
    }
    if (lesseeID == "noLesseeID") {
        callback(null, null);
        return;
    }
    callback(null, stationData.stationID);
};
Service.prototype.delStationFromLessee = function (lesseeID, stationID, traceContext, callback) {
    if (!lesseeID || !stationID) {
        callback(null, false);
        return;
    }
    if (lesseeID == "noLesseeID" || stationID == "noStationID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Service.prototype.assignMemberToLesseeStation = function (lesseeID, stationID, memberID, traceContext, callback) {
    if (!lesseeID || !stationID || !memberID) {
        callback(null, false);
        return;
    }
    if (lesseeID == "noLesseeID" || stationID == "noStationID" || memberID == "noMemberID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Service.prototype.obtainMemberDutyStations = function (memberID, traceContext, callback) {
    if (!memberID) {
        callback(null, null);
        return;
    }
    if (memberID == "noMemberID") {
        callback(null, null);
        return;
    }
    var stationDatas = [];
    var station = {};
    station.stationID = "stationID";
    station.stationName = "stationName";
    station = new Station(station);
    stationDatas.push(station);
    callback(null, stationDatas);
};


module.exports = Service;
