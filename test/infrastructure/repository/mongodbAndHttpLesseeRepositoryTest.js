'use strict';
const _ = require('underscore');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const should = require('should');
const {Lessee, LesseeInfo, WechatInfo} = require('../../../lib/domain/lesseeAndMember');
const MongodbAndHttpLesseeRepository = require('../../../lib/infrastructure/repository/mongodbAndHttpLesseeRepository');

describe('lessee repository MongoDB and http use case test', ()=> {
    let repository;
    before(()=> {
        repository = new MongodbAndHttpLesseeRepository();
    });
    describe('#saveLessee(lessee, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('save a lessee', ()=> {
            it('should return true if save success', done=> {
                let lesseeInfo = new LesseeInfo({lesseeName: "lesseeName"});
                let wechatInfo = new WechatInfo({corpID: "corpID",isActived: false});
                let lessee = new Lessee({
                    lesseeID: "lesseeID",
                    lesseeInfo: lesseeInfo,
                    wechatInfo: wechatInfo,
                    isActived: true
                });
                repository.saveLessee(lessee, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getLesseeByID(lesseeID, traceContext, callback)//callback(err,lessee)', ()=> {
        context('get a lessee by id', ()=> {
            it('should return null if no exits such lessee', done=> {
                var lesseeID = "noLesseeID";
                repository.getLesseeByID(lesseeID, {}, (err, lessee)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(lessee).should.be.eql(true);
                    done();
                });
            });
            it('should return a lessee if success', done=> {
                var lesseeID = "lesseeID";
                repository.getLesseeByID(lesseeID, {}, (err, lessee)=> {
                    if (err) {
                        done(err);
                    }
                    lessee.lesseeID.should.be.eql("lesseeID");
                    lessee.isActived.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getLesseeByCorpID(corpID, traceContext, callback)//callback(err,lessee)', ()=> {
        context('get a lessee by id', ()=> {
            it('should return null if no exits such lessee', done=> {
                var corpID = "noCorpID";
                repository.getLesseeByCorpID(corpID, {}, (err, lessee)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(lessee).should.be.eql(true);
                    done();
                });
            });
            it('should return a lessee if success', done=> {
                var corpID = "corpID";
                repository.getLesseeByCorpID(corpID, {}, (err, lessee)=> {
                    if (err) {
                        done(err);
                    }
                    lessee.wechatInfo._corpID.should.be.eql("corpID");
                    done();
                });
            });
        });
    });
    describe('#getLesseesByID(lesseeID, traceContext, callback)//callback(err,lessees)', ()=> {
        context('get lessees by id', ()=> {
            it('should return null if no exits such lessee', done=> {
                var lesseeID = "noLesseeID";
                repository.getLesseesByID(lesseeID, {}, (err, lessees)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(lessees).should.be.eql(true);
                    done();
                });
            });
            it('should return all if lessee is ""', done=> {
                var lesseeID = "";
                repository.getLesseesByID(lesseeID, {}, (err, lessees)=> {
                    if (err) {
                        done(err);
                    }
                    lessees.length.should.be.eql(1);
                    done();
                });
            });
            it('should return a lessee if success', done=> {
                var lesseeID = "lesseeID";
               repository.getLesseesByID(lesseeID, {}, (err, lessees)=> {
                    if (err) {
                        done(err);
                    }
                   lessees.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#deleteLessee(lesseeID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('remove an account of id', ()=> {
            it('should return null if no this account', (done)=> {
                var lesseeID = "noLesseeID";
                repository.deleteLessee(lesseeID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return true if del one station', (done)=> {
                var lesseeID = "lesseeID";
                repository.deleteLessee(lesseeID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(done=> {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Lessee`, (err, db)=> {
            if (err) {
                done(err);
                return;
            }
            db.collection('LesseeInfo').drop((err, response)=> {
                db.close();
                done();
            });
        });
    });
});
