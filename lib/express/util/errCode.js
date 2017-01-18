'use strict';

var errCodeTable = {
    "ERR": {
        errCode: 500,
        errMsg: "Server internal error, please try again later."
    },
    "FAIL": {
        errCode: 400,
        errMsg: "Fail"
    },
    "OK": {
        errCode: 200,
        errMsg: "OK"
    }
};

module.exports = errCodeTable;