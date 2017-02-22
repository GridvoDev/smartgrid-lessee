'use strict';
const _ = require('underscore');
const should = require('should');
const LesseeService = require('../../../lib/application/service/lesseeService');

describe('lessee service use case test', ()=> {
    let service;
    before(()=> {
        service = new LesseeService();
    });
    describe('#registerLessee(lesseeData, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('register and save lessee data', ()=> {
            it('fail if no lessee data', done=> {
                let lesseeData = null;
                service.registerLessee(lesseeData, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if lessee data is illegal', done=> {
                let lesseeData = {};
                lesseeData.lesseeID = null;
                service.registerLessee(lesseeData, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', done=> {
                let lesseeData = {};
                lesseeData.lesseeID = "lesseeID";
                lesseeData.corpID = "corpID";
                lesseeData.lesseeName = "lesseeName";
                service.registerLessee(lesseeData, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#changeCorpWechatActiveState(cropID,isActived, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('change lessee active state', ()=> {
            it('fail if data is illegal', done=> {
                let corpID = null;
                service.changeCorpWechatActiveState(corpID, true, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such lessee', done=> {
                let corpID = "noCorpID";
                service.changeCorpWechatActiveState(corpID, true, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', done=> {
                let corpID = "corpID";
                let isActived = true;
                service.changeCorpWechatActiveState(corpID, isActived, {} , (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#addStationToLessee(lesseeID,stationData, traceContext, callback)//callback(err,stationID)', ()=> {
        context('add station to lessee', ()=> {
            it('fail if no exits such lessee', done=> {
                let lesseeID = "noLesseeID";
                let stationData = {};
                stationData.stationID = "stationID";
                stationData.stationName = "stationName";
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    _.isNull(stationID).should.be.eql(true);
                    done();
                });
            });
            it('fail if no station data', done=> {
                let lesseeID = "lesseeID";
                let stationData = {};
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    _.isNull(stationID).should.be.eql(true);
                    done();
                });
            });
            it('success', done=> {
                let lesseeID = "lesseeID";
                let stationData = {};
                stationData.stationID = "stationID";
                stationData.stationName = "stationName";
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    stationID.should.be.eql("stationID");
                    done();
                });
            });
        });
    });
    describe('#delStationFromLessee(lesseeID, stationID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('del station from lessee', ()=> {
            it('fail if no exits such lessee', done=> {
                let lesseeID = "noLesseeID";
                let stationID = "stationID";
                service.delStationFromLessee(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('fail if no exits such station', done=> {
                let lesseeID = "lesseeID";
                let stationID = "noStationID";
                service.delStationFromLessee(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', done=> {
                let lesseeID = "lesseeID";
                let stationID = "stationID";
                service.delStationFromLessee(lesseeID, stationID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getLessee(lesseeID, traceContext, callback)//callback(err,lessee)', ()=> {
        context('get lessees by id', ()=> {
            it('should return null if no exits such lessee', done=> {
                let lesseeID = "noLesseeID";
                service.getLessee(lesseeID, {}, (err, lessee)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(lessee).should.be.eql(true);
                    done();
                });
            });
            it('should return a lessee if success', done=> {
                let lesseeID = "lesseeID";
                service.getLessee(lesseeID, {}, (err, lessee)=> {
                    if (err) {
                        done(err);
                    }
                    lessee.lesseeID.should.be.eql(lesseeID);
                    done();
                });
            });
        });
    });
    describe('#getLessees(traceContext, callback)//callback(err,lessees)', ()=> {
        context('get lessees by id', ()=> {
            it('should return a lessee if success', done=> {
                service.getLessees({}, (err, lessees)=> {
                    if (err) {
                        done(err);
                    }
                    lessees.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#getStation(stationID, traceContext, callback)//callback(err,stationsJSON)', ()=> {
        context('get stations by id', ()=> {
            let lesseeID = "lesseeID";
            let stationData = {};
            stationData.stationID = "stationID";
            stationData.stationName = "stationName";
            before(done =>{
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    stationID.should.be.eql("stationID");
                    done();
                });
            });

            it('should return null if no exits such station', done=> {
                let stationID = "noStationID";
                service.getStation(stationID, {}, (err, station)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(station).should.be.eql(true);
                    done();
                });
            });
            it('should return a station if success', done=> {
                let stationID = "stationID";
                service.getStation(stationID, {}, (err, station)=> {
                    if (err) {
                        done(err);
                    }
                    station.stationID.should.be.eql(stationID);
                    done();
                });
            });
        });
    });
    describe('#getStations(traceContext, callback)//callback(err,stationsJSON)', ()=> {
        context('get stations by id', ()=> {
            let lesseeID = "lesseeID";
            let stationData = {};
            stationData.stationID = "stationID";
            stationData.stationName = "stationName";
            before(done =>{
                service.addStationToLessee(lesseeID, stationData, {}, (err, stationID)=> {
                    stationID.should.be.eql("stationID");
                    done();
                });
            });

            it('should return a station if success', done=> {
                service.getStations({}, (err, stations)=> {
                    if (err) {
                        done(err);
                    }
                    stations.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#delLessee(lesseeID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('find lessee', ()=> {
            it('fail if no exits such lessee', done=> {
                let lesseeID = "noLesseeID";
                service.delLessee(lesseeID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('success', done=> {
                let lesseeID = "lesseeID";
                service.delLessee(lesseeID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });

    // describe('#assignMemberToLesseeStation(lesseeID, stationID,memberID,callback)//callback(err,isSuccess)', ()=> {
    //     context('assign member to one station', ()=> {
    //         it('fail if no exits such lessee', done=> {
    //             let lesseeID = "noLesseeID";
    //             let stationID = "stationID";
    //             let memberID = "memberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('fail if no exits such station', done=> {
    //             let lesseeID = "lesseeID";
    //             let stationID = "noStationID";
    //             let memberID = "memberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('fail if no exits such member', done=> {
    //             let lesseeID = "lesseeID";
    //             let stationID = "stationID";
    //             let memberID = "noMemberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(false);
    //                 done();
    //             });
    //         });
    //         it('success', done=> {
    //             let lesseeID = "lesseeID";
    //             let stationID = "stationID";
    //             let memberID = "memberID";
    //             service.assignMemberToLesseeStation(lesseeID, stationID, memberID, (err, isSuccess)=> {
    //                 isSuccess.should.be.eql(true);
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('#obtainMemberDutyStations(memberID,callback)//callback(err,stationDatas)', ()=> {
    //     context('obtain the stations which the member in charge of', ()=> {
    //         it('fail if no exits such member', done=> {
    //             let memberID = "noMemberID";
    //             service.obtainMemberDutyStations(memberID, (err, stationDatas) {
    //                 _.isNull(stationDatas).should.be.eql(true);
    //                 done();
    //             });
    //         });
    //         it('success', done=> {
    //             let memberID = "memberID";
    //             service.obtainMemberDutyStations(memberID, (err, stationDatas) {
    //                 stationDatas.length.should.be.eql(1);
    //                 done();
    //             });
    //         });
    //     });
    // });
});