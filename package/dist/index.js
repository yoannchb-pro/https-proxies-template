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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitProxiesUpdated = exports.getProxy = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const http_1 = __importDefault(require("http"));
var Anonymity;
(function (Anonymity) {
    Anonymity[Anonymity["UNKNOWN"] = 0] = "UNKNOWN";
    Anonymity[Anonymity["LOW"] = 1] = "LOW";
    Anonymity[Anonymity["AVERAGE"] = 2] = "AVERAGE";
    Anonymity[Anonymity["HIGH"] = 3] = "HIGH";
})(Anonymity || (Anonymity = {}));
let api = null;
const errors = ["Bad proxy string", "Proxy offline"];
/**
 * Check if a proxy is valid or not
 * @param proxy
 * @returns
 */
function proxyCheck(proxy) {
    return new Promise((resolve, reject) => {
        var _a;
        const proxyOptions = {
            method: "CONNECT",
            path: "www.google.com:443",
            timeout: (_a = proxy.timeout) !== null && _a !== void 0 ? _a : 2000,
            agent: false,
            host: proxy.ip,
            port: proxy.port,
        };
        const req = http_1.default.request(proxyOptions);
        req.on("connect", (res) => {
            req.destroy();
            if (res.statusCode === 200) {
                return resolve(true);
            }
            else {
                return reject(errors[1]);
            }
        });
        req.on("timeout", () => {
            req.destroy();
        });
        req.on("error", (err) => {
            return reject(err || errors[1]);
        });
        req.end();
    });
}
/**
 * Check if proxy list need update or not
 * @returns A boolean to describe if proxies have been updated or not
 */
function updateProxiesOnNeed() {
    return __awaiter(this, void 0, void 0, function* () {
        function update() {
            return __awaiter(this, void 0, void 0, function* () {
                const req = yield (0, node_fetch_1.default)("https://raw.githubusercontent.com/yoannchb-pro/https-proxies/main/proxies.json");
                const response = (yield req.json());
                if ((api === null || api === void 0 ? void 0 : api.lastUpdate) === response.lastUpdate)
                    return false;
                api = response;
                return true;
            });
        }
        if (!api)
            return yield update();
        const nextUpdateTime = new Date(api === null || api === void 0 ? void 0 : api.lastUpdate);
        nextUpdateTime.setHours(nextUpdateTime.getHours() + 2);
        if (nextUpdateTime <= new Date())
            return yield update();
        return false;
    });
}
/**
 * Wait the proxy list have been updated
 * @returns
 */
function waitProxiesUpdated() {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let updated;
        while ((updated = yield updateProxiesOnNeed()) === false) {
            yield new Promise((_) => setTimeout(_, 5000));
        }
        resolve();
    }));
}
exports.waitProxiesUpdated = waitProxiesUpdated;
/**
 * Find a proxy with specified filters
 * @param filters
 * @returns
 */
function findProxyWithFilters(filters) {
    const proxyIndex = api.proxies.findIndex((proxy) => {
        const filtersKeys = Object.keys(filters);
        return filtersKeys.length === 0
            ? true
            : filtersKeys.every((filterName) => {
                var _a;
                const filterValue = filters[filterName];
                switch (filterName) {
                    case "maxSpeed":
                        return (_a = proxy.speed) !== null && _a !== void 0 ? _a : Infinity < filterValue;
                    case "https":
                        return proxy.https === filterValue;
                    case "anonymity":
                        return filterValue === null || filterValue === void 0 ? void 0 : filterValue.includes(proxy.anonymity);
                    case "country":
                        return filterValue === null || filterValue === void 0 ? void 0 : filterValue.includes(proxy.country);
                    case "port":
                        return filterValue === null || filterValue === void 0 ? void 0 : filterValue.includes(proxy.port);
                    default:
                        return true;
                }
            });
    });
    return proxyIndex;
}
/**
 * Get a proxy with specific filters
 * @param filters
 * @returns
 */
function getProxy(filters = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateProxiesOnNeed();
        let isProxyValid = false;
        while (!isProxyValid) {
            const proxyIndex = findProxyWithFilters(filters);
            if (proxyIndex === -1)
                return null;
            const proxy = api.proxies.splice(proxyIndex, 1)[0];
            isProxyValid = yield proxyCheck({
                ip: proxy.ip,
                port: proxy.port,
                timeout: proxy.speed,
            }).catch(() => false);
            return proxy;
        }
    });
}
exports.getProxy = getProxy;
//# sourceMappingURL=index.js.map