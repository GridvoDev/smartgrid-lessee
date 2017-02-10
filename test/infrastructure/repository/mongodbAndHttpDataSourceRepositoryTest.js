'use strict';
const _ = require('underscore');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const should = require('should');
const {DataSource} = require('../../../lib/domain/lesseeAndMember');
const MongodbAndHttpDataSourceRepository = require('../../../lib/infrastructure/repository/mongodbAndHttpDataSourceRepository');

describe('lessee repository MongoDB and http use case test', ()=> {
    let repository;
    before(()=> {
        repository = new MongodbAndHttpDataSourceRepository();
    });
    describe('#saveDataSource(dataSource, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('save a dataSource', ()=> {
            it('should return true if save success', done=> {
                let dataSource = new DataSource({
                    dataSourceID: "station-datatype-other",
                    dataSourceType: "dataSourceType",
                    station: "stationID",
                    lessee: "lesseeID"
                });
                repository.saveDataSource(dataSource, {}, (err, isSuccess)=> {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getDatasByDataSourceID(dataSourceID, traceContext, callback)//callback(err,datas)', ()=> {
        context('get data source by id', ()=> {
            it('should return null if no exits such dataSourceID', done=> {
                let dataSourceID = "noDataSourceID";
                repository.getDatasByDataSourceID(dataSourceID, {}, (err, datas)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(datas).should.be.eql(true);
                    done();
                });
            });
            it('should return a lessee if success', done=> {
                let dataSourceID = "station-datatype-other";
                repository.getDatasByDataSourceID(dataSourceID, {}, (err, datas)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(datas).should.be.eql(false);
                    datas.length.should.be.eql(1);
                    done();
                });
            });
            it('should return all if dataSourceID is ""', done=> {
                let dataSourceID = "";
                repository.getDatasByDataSourceID(dataSourceID, {}, (err, datas)=> {
                    if (err) {
                        done(err);
                    }
                    _.isNull(datas).should.be.eql(false);
                    datas.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#deleteDataSource(dataSourceID, traceContext, callback)//callback(err,isSuccess)', ()=> {
        context('remove an account of id', ()=> {
            it('should return null if no this account', (done)=> {
                let dataSourceID = "noDataSourceID";
                repository.deleteDataSource(dataSourceID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('should return true if del one station', (done)=> {
                let dataSourceID = "station-datatype-other";
                repository.deleteDataSource(dataSourceID, {}, (err, isSuccess)=> {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(done=> {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/DataSource`, (err, db)=> {
            if (err) {
                done(err);
                return;
            }
            db.collection('DataSourceInfo').drop((err, response)=> {
                db.close();
                done();
            });
        });
    });
});
