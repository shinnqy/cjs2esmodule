
import * as t from '@babel/types'
import { replaceWithDefault, replaceWithProp, replaceWithRequire, replaceWithRest } from "../replace/require";
import { replaceExports } from "../replace/exports";
import { getName, getSafe } from "../utils/get";

export const cjs2esmVisitors = {
  VariableDeclaration(path) {
    const ctr = path.node.declarations[0]

    try {
      if (getSafe(ctr, 'init.property')) {
        replaceWithProp(ctr, path);
      } else if (ctr.id.type === 'ObjectPattern') {
        replaceWithRest(ctr, path)
      } else if (getName(ctr, 'init.callee') === 'require') {
        replaceWithDefault(ctr, path)
      }
    } catch (err) {
      console.log(err)
    }
  },
  CallExpression(path) {
    if (t.isExpressionStatement(path.parent)) {
      replaceWithRequire(path)
    }
  },

  // 导出
  AssignmentExpression(path) {
    try {
      const { node } = path
      replaceExports(node, path)
    } catch (err) {
      console.log(err)
    }
  },
}

export const namespaceImportVisitors = {
	ImportDeclaration(path) {
    const originalNode = path.node;
    const originalSpecifier = originalNode.specifiers[0];
    if (originalSpecifier.type !== 'ImportNamespaceSpecifier') {
      return;
    }

    const newNode = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(originalSpecifier.local.name))],
      t.stringLiteral(originalNode.source.value),
    );

    path.replaceWith(newNode);
  },
};
