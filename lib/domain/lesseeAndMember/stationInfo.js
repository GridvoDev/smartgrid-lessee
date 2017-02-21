'use strict';

class StationInfo{
    constructor({stationName}) {
        this._stationName = stationName;
    }
    get stationName(){
        return this._stationName;
    }
}

module.exports = StationInfo;