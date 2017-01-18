'use strict';

class StationInfo{
    constructor(stationData) {
        this._stationName = stationData.stationName;
    }
    get stationName(){
        return this._stationName;
    }
}

module.exports = StationInfo;