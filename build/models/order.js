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
exports.OrderStore = void 0;
var database_1 = __importDefault(require("../database/database"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var OrderStore = /** @class */ (function () {
    function OrderStore() {
    }
    OrderStore.prototype.index = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT * FROM orders';
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error("Cannot get orders ".concat(err_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.show = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = 'SELECT * FROM orders WHERE id=($1)';
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        err_2 = _a.sent();
                        throw new Error("Could not find order ".concat(id, ". Error: ").concat(err_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.create = function (b) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql2, conn, result, order, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (b.status !== "active" && b.status !== "completed") {
                            throw new Error("An order status must be either active or completed");
                        }
                        sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
                        sql2 = "SELECT id FROM orders WHERE user_id = $1 and status = 'active'";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql2, [b.user_id])];
                    case 2:
                        result = _a.sent();
                        if (result.rows[0] != undefined) {
                            throw new Error("User ".concat(b.user_id, " has already an active order in the Database."));
                        }
                        return [4 /*yield*/, conn.query(sql, [b.status, b.user_id])];
                    case 3:
                        result = _a.sent();
                        order = result.rows[0];
                        conn.release();
                        return [2 /*return*/, order];
                    case 4:
                        err_3 = _a.sent();
                        throw new Error("Could not create order ".concat(b, ". Error: ").concat(err_3));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, order, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = 'DELETE FROM orders WHERE id=($1)';
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [id])];
                    case 2:
                        result = _a.sent();
                        order = result.rows[0];
                        conn.release();
                        return [2 /*return*/, order];
                    case 3:
                        err_4 = _a.sent();
                        throw new Error("Could not delete order ".concat(id, ". Error: ").concat(err_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /*async updateItem(quantity: number, orderId: string, itemId: string) {
      try {
        let conn = await dbclient.connect();
        console.log(`Product not present in order_items. Will insert new quantity ${quantity} for product id ${itemId} and order id ${orderId}.`);
        const sqlinsert = "INSERT INTO order_items (quantity, order_id, item_id) values ($1, $2, $3) RETURNING *";
        const result = await conn.query(sqlinsert, [quantity, orderId, itemId]);
        conn.release();
        return result;
      } catch (err) {
        throw new Error(`Could not insert new order item with quantity ${quantity}, order id ${orderId}, and item id ${itemId}: ${err}`);
      }
    }
  
    async insertItem(quantity: number, orderItemId: string) {
      try {
        let conn = await dbclient.connect();
        console.log(`Product already present in order_items with id ${orderItemId}. Will increase its quantity by ${quantity}.`);
        const sqlupdate = "UPDATE order_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *";
        const result = await conn.query(sqlupdate, [quantity, orderItemId]);
        conn.release();
        return result;
      } catch (err) {
        throw new Error(`Could not update quantity ${quantity} for order item ${orderItemId}: ${err}`);
      }
    }
  
    async checkItemInOrder(orderId: string, itemId: string): Promise<OrderItem> {
      try {
        let conn = await dbclient.connect();
        console.log(`Checking if there is an existing record for order id ${orderId} and item id ${itemId} in order items.`);
        const sql = "SELECT id, quantity, order_id, item_id FROM order_items WHERE order_id = $1 and item_id = $2";
        const result = await conn.query(sql, [orderId, itemId]);
        conn.release();
        console.log(result.rows[0]);
        return result.rows[0];
      } catch (err) {
        throw new Error(`Error during query execution: ${err}`);
      }
    }*/
    OrderStore.prototype.addItem = function (quantity, orderId, itemId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sqlupsert, result, order, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        //let sql = "SELECT status FROM orders WHERE id = $1";
                        //let conn = await dbclient.connect();
                        //let result = await conn.query(sql, [orderId]);
                        //const status = result.rows[0]['status'];
                        //console.log(`Retrieved status ${status} for order with id ${orderId}.`);
                        //conn.release();
                        //if (status != "active") {
                        //  throw new Error(`Could not add product ${itemId} to order ${orderId} because order status is ${status}`);
                        //}
                        console.log("[order] - addItem");
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sqlupsert = "INSERT INTO order_items (quantity, order_id, item_id) values ($1, $2, $3)";
                        sqlupsert = sqlupsert + " ON CONFLICT ON CONSTRAINT order_items_order_id_item_id_key do UPDATE SET quantity = $1 RETURNING *";
                        return [4 /*yield*/, conn.query(sqlupsert, [quantity, orderId, itemId])];
                    case 2:
                        result = _a.sent();
                        order = result.rows[0];
                        console.log(order);
                        conn.release();
                        return [2 /*return*/, order];
                    case 3:
                        err_5 = _a.sent();
                        throw new Error("Could not add item ".concat(itemId, " to order ").concat(orderId, ": ").concat(err_5));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.submit = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, submittedOrder, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "UPDATE orders SET status = 'completed' WHERE id = $1 RETURNING *";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [orderId])];
                    case 2:
                        result = _a.sent();
                        submittedOrder = result.rows[0];
                        conn.release();
                        return [2 /*return*/, submittedOrder];
                    case 3:
                        err_6 = _a.sent();
                        throw new Error("Could not submit order ".concat(orderId, ": ").concat(err_6));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.currentOrder = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.username = ($1) and o.status = 'active'";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        err_7 = _a.sent();
                        throw new Error("Cannot get active order for user ".concat(username, ". Error: ").concat(err_7));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.completedOrders = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.username = ($1) and o.status = 'completed'";
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows];
                    case 3:
                        err_8 = _a.sent();
                        throw new Error("Cannot get completed orders for user ".concat(username, ". Error: ").concat(err_8));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return OrderStore;
}());
exports.OrderStore = OrderStore;
