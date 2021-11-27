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
var products_1 = require("../models/products");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var url_1 = __importDefault(require("url"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var store = new products_1.ProductStore();
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, category, products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = url_1.default.parse(req.url, true).query;
                category = query.category;
                products = undefined;
                if (!(category === "" || category == undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, store.index()];
            case 1:
                products = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, store.indexByCategory(category)];
            case 3:
                products = _a.sent();
                _a.label = 4;
            case 4:
                res.json(products);
                return [2 /*return*/];
        }
    });
}); };
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.show(req.params.id)];
            case 1:
                product = _a.sent();
                res.json(product);
                return [2 /*return*/];
        }
    });
}); };
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, newProduct, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                product = {
                    name: req.body.name,
                    type: req.body.type,
                    category: req.body.category,
                    weight: req.body.weight,
                    price: req.body.price
                };
                try {
                    // the token should be retrieved from the authorizazion header after the Bearer string
                    // but for simplicity we put it as part of the request body for now
                    //const authorizationHeader: string = (req.headers.authorization as string);
                    //const token = authorizationHeader.split(' ')[1];
                    //jwt.verify(token, (process.env.TOKEN_SECRET as string));
                    jsonwebtoken_1.default.verify(req.body.token, process.env.TOKEN_SECRET);
                }
                catch (err) {
                    res.status(401); // unauthorized
                    res.json("Invalid token ".concat(err));
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.create(product)];
            case 2:
                newProduct = _a.sent();
                res.json(newProduct);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(400);
                res.json(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var destroy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authorizationHeader, token, deleted, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    authorizationHeader = req.headers.authorization;
                    token = authorizationHeader.split(' ')[1];
                    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                }
                catch (err) {
                    res.status(401);
                    res.json('Access denied. Invalid token.');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.delete(req.params.id)];
            case 2:
                deleted = _a.sent();
                res.json(deleted);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(400);
                res.json({ err: err_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var product_routes = function (app) {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', create);
    app.post('/products/:id', destroy);
};
exports.default = product_routes;
