'use strict';

class DataSource{
    constructor({dataSourceID, dataSourceType, station, lessee }) {
        this._dataSourceID = dataSourceID;
        this._dataSourceType = dataSourceType;
        this._station  = station ;
        this._lessee  = lessee ;
    }
    get dataSourceID(){
        return this._dataSourceID;
    }
    get dataSourceType(){
        return this._dataSourceType;
    }
    get station(){
        return this._station;
    }
    get lessee(){
        return this._lessee;
    }
}

module.exports = DataSource;