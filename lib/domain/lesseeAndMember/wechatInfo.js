'use strict';

class WechatInfo{
    constructor(wechatData) {
        this._corpID = wechatData.corpID;
        this._isActived = wechatData.isActived;
    }
    get corpID(){
        return this._corpID;
    }
    get isActived(){
        return this._isActived;
    }
}

module.exports = WechatInfo;