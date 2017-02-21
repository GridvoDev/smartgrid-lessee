'use strict';
var Station = require('./station');
var StationInfo = require('./stationInfo');

class Lessee{
    constructor({lesseeID, lesseeInfo, wechatInfo, isActived}) {
        this._lesseeID = lesseeID;
        this._lesseeInfo = lesseeInfo;
        this._wechatInfo = wechatInfo;
        this._isActived = isActived ? isActived : true;
    }
    get lesseeID(){
        return this._lesseeID;
    }
    get lesseeInfo(){
        return this._lesseeInfo;
    }
    get wechatInfo(){
        return this._wechatInfo;
    }
    get isActived(){
        return this._isActived;
    }
    active() {
        this._isActived = true;
        this.wechatInfo._isActived = true;
        return;
    }
    inactive() {
        this._isActived = false;
        this.wechatInfo._isActived = false;
        return;
    }
    createStation(stationData){
        let station = {};
        station.stationID = stationData.stationID;
        station.stationInfo = new StationInfo(stationData.stationName);
        station.lesseeID = this.lesseeID;
        station.members = [];
        station = new Station(station);
        return station;
    }
}

module.exports = Lessee;