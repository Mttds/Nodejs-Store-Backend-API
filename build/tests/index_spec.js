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
var supertest_1 = __importDefault(require("supertest"));
var index_1 = __importDefault(require("../index"));
var request = (0, supertest_1.default)(index_1.default);
var user = { firstname: 'testendpoint', lastname: 'testendpoint', username: 'testendpoint', password: 'testendpoint' };
var userId = "0";
var productId = "0";
var orderId = "0";
var product = { name: 'testproduct', type: 'test', category: 'testcategory', weight: 1, price: 1 };
var token = "";
describe('Endpoint tests', function () {
    //==================================================================
    // Users
    //==================================================================
    // create
    it('posts to the users endpoint to create a user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.post('/users').send(user)];
                case 1:
                    response = _a.sent();
                    token = response.body;
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // index without authorization
    it('gets the users endpoint with no request body to get an unathorized (no token provided)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/users')];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    // index with authorization
    it('gets the users endpoint providing a token', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.get('/users').set(headers)];
                case 1:
                    response = _a.sent();
                    userId = response.body[0].id;
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // authentication with password
    it('posts to the users/authenticate endpoint providing the correct password', function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = { 'username': user.username, 'password': user.password };
                    return [4 /*yield*/, request.post('/users/authenticate').send(body)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    //==================================================================
    // Products
    //==================================================================
    // index
    it('gets the products endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/products')];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // show
    it('gets the products endpoint with id 1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/products/1')];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // index by category
    it('gets the products endpoint with category testcategory', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/products?category=testcategory')];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // create
    it('posts to the products endpoint to create a product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.post('/products').set(headers).send(product)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // index by category after product creation
    it('gets the products endpoint with category testcategory after creating a product for the category', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/products?category=testcategory')];
                case 1:
                    response = _a.sent();
                    productId = response.body[0].id;
                    expect(response.status).toBe(200);
                    expect(response.body[0].name).toEqual("testproduct");
                    return [2 /*return*/];
            }
        });
    }); });
    //==================================================================
    // Orders
    //==================================================================
    // create
    it('posts to the orders endpoint to create an order with the previously created user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, order, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    order = { 'user_id': userId, 'status': 'active' };
                    return [4 /*yield*/, request.post('/orders').set(headers).send(order)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // index
    it('gets the orders endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.get('/orders').set(headers)];
                case 1:
                    response = _a.sent();
                    orderId = response.body[0].id;
                    expect(response.body[0].status).toBe("active");
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // orders/current
    it('gets the orders/current?username=:username endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.get('/orders/current').query({ 'username': 'testendpoint' }).set(headers)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('gets the orders/completed?username=:username endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.get('/orders/completed').query({ 'username': 'testendpoint' }).set(headers)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    //==================================================================
    // Cleanup using delete endpoints for users, products, and orders
    // Must be done in the correct order due to database foreign keys
    //==================================================================
    // delete the created order with authorization
    it('posts to the orders/:id endpoint to delete the created order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.post("/orders/".concat(orderId)).set(headers)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // delete the created product with authorization
    it('posts to the products/:id endpoint to delete the created product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.post("/products/".concat(productId)).set(headers)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    // delete the created user with authorization
    it('posts to the users/:id endpoint to delete the created user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
                    return [4 /*yield*/, request.post("/users/".concat(userId)).set(headers)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
