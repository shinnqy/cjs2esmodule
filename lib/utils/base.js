"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCjsFile = exports.generateTransformer = void 0;
const parser = __importStar(require("@babel/parser"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const generateTransformer = visitors => (src) => {
    try {
        const ast = parser.parse(src);
        (0, traverse_1.default)(ast, visitors);
        return (0, generator_1.default)(ast);
    }
    catch (err) {
        // sourceType 默认为 script，如果报错，则用 module 解析
        const ast = parser.parse(src, { sourceType: "module" });
        (0, traverse_1.default)(ast, visitors);
        return (0, generator_1.default)(ast);
    }
};
exports.generateTransformer = generateTransformer;
function isCjsFile(content) {
    return /(exports[\.\[]|module\.exports|require\()/g.test(content);
}
exports.isCjsFile = isCjsFile;
