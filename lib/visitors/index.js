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
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespaceImportVisitors = exports.cjs2esmVisitors = void 0;
const t = __importStar(require("@babel/types"));
const require_1 = require("../replace/require");
const exports_1 = require("../replace/exports");
const get_1 = require("../utils/get");
exports.cjs2esmVisitors = {
    VariableDeclaration(path) {
        const ctr = path.node.declarations[0];
        try {
            if ((0, get_1.getSafe)(ctr, 'init.property')) {
                (0, require_1.replaceWithProp)(ctr, path);
            }
            else if (ctr.id.type === 'ObjectPattern') {
                (0, require_1.replaceWithRest)(ctr, path);
            }
            else if ((0, get_1.getName)(ctr, 'init.callee') === 'require') {
                (0, require_1.replaceWithDefault)(ctr, path);
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    CallExpression(path) {
        if (t.isExpressionStatement(path.parent)) {
            (0, require_1.replaceWithRequire)(path);
        }
    },
    // 导出
    AssignmentExpression(path) {
        try {
            const { node } = path;
            (0, exports_1.replaceExports)(node, path);
        }
        catch (err) {
            console.log(err);
        }
    },
};
const namespaceImportVisitors = (importFromInclude) => ({
    ImportDeclaration(path) {
        const originalNode = path.node;
        const originalSpecifier = originalNode.specifiers[0];
        const originalSourceValue = originalNode.source.value;
        if (originalSpecifier.type !== 'ImportNamespaceSpecifier') {
            return;
        }
        if (!importFromInclude.includes(originalSourceValue)) {
            return;
        }
        const newNode = t.importDeclaration([t.importDefaultSpecifier(t.identifier(originalSpecifier.local.name))], t.stringLiteral(originalSourceValue));
        path.replaceWith(newNode);
    },
});
exports.namespaceImportVisitors = namespaceImportVisitors;
