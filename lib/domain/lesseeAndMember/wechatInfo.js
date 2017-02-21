'use strict';

class WechatInfo{
    constructor({corpID,corpIsActived}) {
        this._corpID = corpID;
        this._corpIsActived = corpIsActived;
    }
    get corpID(){
        return this._corpID;
    }
    get corpIsActived(){
        return this._corpIsActived;
    }
}

module.exports = WechatInfo;