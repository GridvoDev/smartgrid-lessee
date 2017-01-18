'use strict';

class LesseeInfo{
    constructor(lesseeData) {
        this._lesseeName = lesseeData.lesseeName;
    }
    get lesseeName(){
        return this._lesseeName;
    }
}

module.exports = LesseeInfo;