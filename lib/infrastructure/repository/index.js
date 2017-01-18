'use strict';
const MongodbAndHttpLesseeRepository = require("./mongodbAndHttpLesseeRepository");
const MongodbAndHttpMemberRepository = require("./mongodbAndHttpMemberRepository");
const MongodbAndHttpPermissionRepository = require("./mongodbAndHttpPermissionRepository");
const MongodbAndHttpRoleRepository = require("./mongodbAndHttpRoleRepository");
const MongodbStationRepository = require("./mongodbStationRepository");

let mongodbAndHttpLesseeRepository = null;
function createLesseeRepository(single = true) {
    if (single && mongodbAndHttpLesseeRepository) {
        return mongodbAndHttpLesseeRepository;
    }
    mongodbAndHttpLesseeRepository = new MongodbAndHttpLesseeRepository();
    return mongodbAndHttpLesseeRepository;
};

let mongodbAndHttpMemberRepository = null;
function createMemberRepository(single = true) {
    if (single && mongodbAndHttpMemberRepository) {
        return mongodbAndHttpMemberRepository;
    }
    mongodbAndHttpMemberRepository = new MongodbAndHttpMemberRepository();
    return mongodbAndHttpMemberRepository;
};

let mongodbAndHttpPermissionRepository = null;
function createPermissionRepository(single = true) {
    if (single && mongodbAndHttpPermissionRepository) {
        return mongodbAndHttpPermissionRepository;
    }
    mongodbAndHttpPermissionRepository = new MongodbAndHttpPermissionRepository();
    return mongodbAndHttpPermissionRepository;
};

let mongodbAndHttpRoleRepository = null;
function createRoleRepository(single = true) {
    if (single && mongodbAndHttpRoleRepository) {
        return mongodbAndHttpRoleRepository;
    }
    mongodbAndHttpRoleRepository = new MongodbAndHttpRoleRepository();
    return mongodbAndHttpRoleRepository;
};

let mongodbStationRepository = null;
function createStationRepository(single = true) {
    if (single && mongodbStationRepository) {
        return mongodbStationRepository;
    }
    mongodbStationRepository = new MongodbStationRepository();
    return mongodbStationRepository;
};

module.exports = {
    createLesseeRepository,
    createMemberRepository,
    createPermissionRepository,
    createRoleRepository,
    createStationRepository
};