import * as fs from 'fs';
import { isCjsFile, generateTransformer } from "./utils/base"
import { cjs2esmVisitors, namespaceImportVisitors } from './visitors';

const transformFileBase = generateTransformer(cjs2esmVisitors);

/**
 *
 * @param sourceDir
 * @returns
 */
export function cjs2esm(
  { include = [], importFromInclude = [] }: { include?: string[], importFromInclude?: string[] }
) {
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
  }
}

export function cjs2esm4esbuild(include: string[] = []) {
  return {
    name: "shinnqy:cjs2esm4esbuild",
    setup(build) {
      build.onLoad(
        {
          filter: new RegExp("(" + include.join("|") + ").*.js"),
          namespace: "file",
        },
        async ({ path: id }) => {
          const code = fs.readFileSync(id).toString();
          const result = transformFileBase(code);
          return {
            contents: result.code,
            loader: "js",
          };
        }
      );
    },
  };
}

export function transformNamespaceImport(
  { include = [], importFromInclude = [] }: { include?: string[], importFromInclude?: string[] }
) {
  const transform = generateTransformer(namespaceImportVisitors(importFromInclude));

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
  }
}

export function transformNamespaceImport4esbuild(
  { include = [], importFromInclude = [] }: { include?: string[], importFromInclude?: string[] }
) {
  const transform = generateTransformer(namespaceImportVisitors(importFromInclude));

  return {
    name: "shinnqy:transformNamespaceImport4esbuild",
    setup(build) {
      build.onLoad(
        {
          filter: new RegExp("(" + include.join("|") + ").*.(js|ts|tsx)"),
          namespace: "file",
        },
        async ({ path: id }) => {
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
        }
      );
    },
  };
}

function getImportRegExp(importFromInclude: string[]) {
  importFromInclude.forEach((i) => {
    i.split('/').join('\\/');
  })
  const exp = `from\\s*(\\'|\\")(${importFromInclude.join("|")})(\\'|\\").*`;
  return new RegExp(exp);
}

export { transformFiles } from './scripts'