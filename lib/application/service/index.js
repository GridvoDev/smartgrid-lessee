'use strict';
const AuthService = require("./authService");
const LesseeService = require("./lesseeService");
const RoleAndPermissionService = require("./roleAndPermissionService");

let authService = null;
function createAuthService(single = true) {
    if (single && authService) {
        return authService;
    }
    authService = new AuthService();
    return authService;
};

let lesseeService = null;
function createLesseeService(single = true) {
    if (single && lesseeService) {
        return lesseeService;
    }
    lesseeService = new LesseeService();
    return lesseeService;
};

let roleAndPermissionService = null;
function createRoleAndPermissionService(single = true) {
    if (single && roleAndPermissionService) {
        return roleAndPermissionService;
    }
    roleAndPermissionService = new RoleAndPermissionService();
    return roleAndPermissionService;
};

module.exports = {
    createAuthService,
    createLesseeService,
    createRoleAndPermissionService
};