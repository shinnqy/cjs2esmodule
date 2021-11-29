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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFiles = exports.transformNamespaceImport4esbuild = exports.transformNamespaceImport = exports.cjs2esm4esbuild = exports.cjs2esm = void 0;
const fs = __importStar(require("fs"));
const base_1 = require("./utils/base");
const visitors_1 = require("./visitors");
const transformFileBase = (0, base_1.generateTransformer)(visitors_1.cjs2esmVisitors);
/**
 *
 * @param sourceDir
 * @returns
 */
function cjs2esm({ include = [], importFromInclude = [] }) {
    return {
        name: 'cjs2esmVitePlugin',
        transform(sourceCode, id) {
            const fileFilter = new RegExp("(" + include.join("|") + ").*.(js|ts|tsx)");
            if (!fileFilter.test(id)) {
                return;
            }
            const importRegExp = getImportRegExp(importFromInclude);
            if (importFromInclude.length > 0 && !importRegExp.test(sourceCode)) {
                return null;
            }
            return transformFileBase(sourceCode);
        }
    };
}
exports.cjs2esm = cjs2esm;
function cjs2esm4esbuild(include = []) {
    return {
        name: "shinnqy:cjs2esm4esbuild",
        setup(build) {
            build.onLoad({
                filter: new RegExp("(" + include.join("|") + ").*.js"),
                namespace: "file",
            }, ({ path: id }) => __awaiter(this, void 0, void 0, function* () {
                const code = fs.readFileSync(id).toString();
                const result = transformFileBase(code);
                return {
                    contents: result.code,
                    loader: "js",
                };
            }));
        },
    };
}
exports.cjs2esm4esbuild = cjs2esm4esbuild;
function transformNamespaceImport({ include = [], importFromInclude = [] }) {
    const transform = (0, base_1.generateTransformer)((0, visitors_1.namespaceImportVisitors)(importFromInclude));
    return {
        name: 'shinnqy:transformNamespaceImport',
        transform(sourceCode, id) {
            const fileFilter = new RegExp("(" + include.join("|") + ").*.(js|ts|tsx)");
            if (!fileFilter.test(id)) {
                return;
            }
            const importRegExp = getImportRegExp(importFromInclude);
            if (importFromInclude.length > 0 && !importRegExp.test(sourceCode)) {
                return null;
            }
            const result = transform(sourceCode);
            return result;
        }
    };
}
exports.transformNamespaceImport = transformNamespaceImport;
function transformNamespaceImport4esbuild({ include = [], importFromInclude = [] }) {
    const transform = (0, base_1.generateTransformer)((0, visitors_1.namespaceImportVisitors)(importFromInclude));
    return {
        name: "shinnqy:transformNamespaceImport4esbuild",
        setup(build) {
            build.onLoad({
                filter: new RegExp("(" + include.join("|") + ").*.(js|ts|tsx)"),
                namespace: "file",
            }, ({ path: id }) => __awaiter(this, void 0, void 0, function* () {
                const code = fs.readFileSync(id).toString();
                const importRegExp = getImportRegExp(importFromInclude);
                if (importFromInclude.length > 0 && !importRegExp.test(code)) {
                    return null;
                }
                const result = transform(code);
                return {
                    contents: result.code,
                    loader: "js",
                };
            }));
        },
    };
}
exports.transformNamespaceImport4esbuild = transformNamespaceImport4esbuild;
function getImportRegExp(importFromInclude) {
    importFromInclude.forEach((i) => {
        i.split('/').join('\\/');
    });
    const exp = `from\\s*(\\'|\\")(${importFromInclude.join("|")})(\\'|\\").*`;
    return new RegExp(exp);
}
var scripts_1 = require("./scripts");
Object.defineProperty(exports, "transformFiles", { enumerable: true, get: function () { return scripts_1.transformFiles; } });
