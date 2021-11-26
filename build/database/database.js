"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
dotenv_1.default.config();
var _a = process.env, DATABASE_HOST = _a.DATABASE_HOST, DATABASE_NAME = _a.DATABASE_NAME, DATABASE_USER = _a.DATABASE_USER, DATABASE_PASSWD = _a.DATABASE_PASSWD, DATABASE_TEST_NAME = _a.DATABASE_TEST_NAME, ENV = _a.ENV;
var dbclient;
console.log(ENV);
if (ENV === 'test') {
    dbclient = new pg_1.Pool({
        host: DATABASE_HOST,
        database: DATABASE_TEST_NAME,
        user: DATABASE_USER,
        password: DATABASE_PASSWD,
    });
}
if (ENV === 'dev') {
    dbclient = new pg_1.Pool({
        host: DATABASE_HOST,
        database: DATABASE_NAME,
        user: DATABASE_USER,
        password: DATABASE_PASSWD,
    });
}
exports.default = dbclient;
