'use strict';

var Station = require('../../../../lib/domain/lesseeAndMember/station.js');
var StationInfo = require('../../../../lib/domain/lesseeAndMember/stationInfo.js');

function Repository() {
}

Repository.prototype.saveStation = function (station, callback) {
    if (!station) {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Repository.prototype.delStation = function (lesseeID, stationID, callback) {
    if (lesseeID == "noLesseeID") {
        callback(null, false);
        return;
    }
    if (stationID == "noStationID") {
        callback(null, false);
        return;
    }
    callback(null, true);
};
Repository.prototype.getStationByID = function (lesseeID, stationID, callback) {
    if (lesseeID == "noLesseeID") {
        callback(null, null);
        return;
    }
    if (stationID == "noStationID") {
        callback(null, null);
        return;
    }
    var station = {};
    station.stationID = stationID;
    station.stationInfo = new StationInfo({stationName: "stationName"});
    station.lesseeID = "lesseeID";
    station = new Station(station);
    callback(null, station);
};
Repository.prototype.getAllStationsByMemberID = function (memberID, callback) {
    if (memberID == "noMemberID") {
        callback(null, null);
        return;
    }
    var stations = [];
    var station = {};
    station.stationID = "stationID";
    station.stationInfo = new StationInfo({stationName: "stationName"});
    station.lesseeID = "lesseeID";
    station = new Station(station);
    stations.push(station);
    callback(null, stations);
};

module.exports = Repository;