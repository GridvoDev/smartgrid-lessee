'use strict';

class LesseeInfo{
    constructor({lesseeName}) {
        this._lesseeName = lesseeName;
    }
    get lesseeName(){
        return this._lesseeName;
    }
}

module.exports = LesseeInfo;