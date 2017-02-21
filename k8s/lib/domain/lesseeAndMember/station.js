'use strict';

class Station{
    constructor({stationID, stationInfo, lesseeID, members}) {
        this._stationID = stationID;
        this._stationInfo = stationInfo;
        this._lesseeID = lesseeID;
        this._members = members ? members : [];
    }
    get stationID(){
        return this._stationID;
    }
    get stationInfo(){
        return this._stationInfo;
    }
    get lesseeID(){
        return this._lesseeID;
    }
    get members(){
        return this._members;
    }
    addMember(member) {
        this._members.push(member.memberID);
    }
}

module.exports = Station;