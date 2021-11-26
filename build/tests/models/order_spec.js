"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var order_1 = require("../../models/order");
var user_1 = require("../../models/user");
var database_1 = __importDefault(require("../../database/database"));
var store = new order_1.OrderStore();
var storeUser = new user_1.UserStore();
describe("Order Model", function () {
    it("should have an index method", function () {
        expect(store.index).toBeDefined();
    });
    it("index method should return a list of records", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.index()];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("show method should return a single object after creating the order with create", function () { return __awaiter(void 0, void 0, void 0, function () {
        var newOrderId, newUserId, mockUser, newUser, sql, conn, result_1, err_1, mockOrder, newOrder, sql, conn, result_2, err_2, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newOrderId = "0";
                    newUserId = "0";
                    mockUser = {
                        username: "testorder",
                        firstname: "testorder",
                        lastname: "testorder",
                        password: "testorder"
                    };
                    return [4 /*yield*/, storeUser.create(mockUser)];
                case 1:
                    newUser = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    sql = 'SELECT id FROM users WHERE username = $1';
                    return [4 /*yield*/, database_1.default.connect()];
                case 3:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query(sql, [newUser.username])];
                case 4:
                    result_1 = _a.sent();
                    newUserId = result_1.rows[0].id;
                    conn.release();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    throw new Error("Could not find user ".concat(newUser.username, ". Error: ").concat(err_1));
                case 6:
                    mockOrder = {
                        status: "active",
                        user_id: newUserId
                    };
                    return [4 /*yield*/, store.create(mockOrder)];
                case 7:
                    newOrder = _a.sent();
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 11, , 12]);
                    sql = 'SELECT id FROM orders WHERE 1=1';
                    return [4 /*yield*/, database_1.default.connect()];
                case 9:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query(sql)];
                case 10:
                    result_2 = _a.sent();
                    newOrderId = result_2.rows[0].id;
                    conn.release();
                    return [3 /*break*/, 12];
                case 11:
                    err_2 = _a.sent();
                    throw new Error("Could not find order ".concat(newOrderId, ". Error: ").concat(err_2));
                case 12: return [4 /*yield*/, store.show(newOrderId)];
                case 13:
                    result = _a.sent();
                    expect(result).toEqual(jasmine.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    it("currentOrder method should return the current active order for the user testorder", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.currentOrder("testorder")];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(jasmine.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    it("submit method should change the status to completed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var orderId, status, sql, conn, result, err_3, _result, sql, conn, result, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    orderId = "0";
                    status = "";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    sql = 'SELECT id FROM orders WHERE 1=1';
                    return [4 /*yield*/, database_1.default.connect()];
                case 2:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query(sql)];
                case 3:
                    result = _a.sent();
                    orderId = result.rows[0].id;
                    conn.release();
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    throw new Error("Could not find order ".concat(orderId, ". Error: ").concat(err_3));
                case 5: return [4 /*yield*/, store.submit(orderId)];
                case 6:
                    _result = _a.sent();
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 10, , 11]);
                    sql = 'SELECT status FROM orders WHERE id = $1';
                    return [4 /*yield*/, database_1.default.connect()];
                case 8:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query(sql, [orderId])];
                case 9:
                    result = _a.sent();
                    status = result.rows[0].status;
                    conn.release();
                    return [3 /*break*/, 11];
                case 10:
                    err_4 = _a.sent();
                    throw new Error("Could not find order ".concat(orderId, ". Error: ").concat(err_4));
                case 11:
                    expect(status).toEqual("completed");
                    return [2 /*return*/];
            }
        });
    }); });
    it("completedOrders method should return the current completed order for the user testorder after the submit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.completedOrders("testorder")];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(jasmine.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    it("delete method should delete the created order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var orderId, sql, conn, result_3, err_5, userid, result, sql, conn, result_4, err_6, _result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    orderId = "0";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    sql = 'SELECT id FROM orders WHERE 1=1';
                    return [4 /*yield*/, database_1.default.connect()];
                case 2:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query(sql)];
                case 3:
                    result_3 = _a.sent();
                    orderId = result_3.rows[0].id;
                    conn.release();
                    return [3 /*break*/, 5];
                case 4:
                    err_5 = _a.sent();
                    throw new Error("Could not find order with id ".concat(orderId, ". Error: ").concat(err_5));
                case 5:
                    userid = "0";
                    return [4 /*yield*/, store.delete(orderId)];
                case 6:
                    result = _a.sent();
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 10, , 11]);
                    sql = 'SELECT id FROM users WHERE 1=1';
                    return [4 /*yield*/, database_1.default.connect()];
                case 8:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query(sql)];
                case 9:
                    result_4 = _a.sent();
                    userid = result_4.rows[0].id;
                    conn.release();
                    return [3 /*break*/, 11];
                case 10:
                    err_6 = _a.sent();
                    throw new Error("Could not find user with id ".concat(userid, ". Error: ").concat(err_6));
                case 11: return [4 /*yield*/, storeUser.delete(userid)];
                case 12:
                    _result = _a.sent();
                    expect(result).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
