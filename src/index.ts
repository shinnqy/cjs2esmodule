import * as fs from 'fs';
import { isCjsFile, generateTransformer } from "./utils/base"
import { cjs2esmVisitors, namespaceImportVisitors } from './visitors';

const transformFileBase = generateTransformer(cjs2esmVisitors);
const transformNamespaceImport = generateTransformer(namespaceImportVisitors);

/**
 *
 * @param sourceDir
 * @returns
 */
export function cjs2esmVitePlugin({ sourceDir = 'src' } = {}) {
  return {
    name: 'cjs2esmVitePlugin',
    transform(src, id) {
      const ROOT = process.cwd().replace(/\\/g, '/') + `/${sourceDir}`

      if (/\.js$/g.test(id) && id.startsWith(ROOT) && isCjsFile(src)) {
        // const { code, map } = transformFileBase(src, id)
        return transformFileBase(src)
      }
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

export function transformNamespaceImport4esbuild(
  { include = [], importFromInclude = [] }: { include: string[], importFromInclude: string[] }
) {
  return {
    name: "shinnqy:transformNamespaceImport4esbuild",
    setup(build) {
      build.onLoad(
        {
          filter: new RegExp("(" + include.join("|") + ").*.js"),
          namespace: "file",
        },
        async ({ path: id }) => {
          const code = fs.readFileSync(id).toString();
          importFromInclude.forEach((i) => {
            i.split('/').join('\\/');
          })
          const exp = `from\\s*(\\'|\\")(${importFromInclude.join("|")})(\\'|\\").*`;
          if (importFromInclude.length > 0 && !(new RegExp(exp)).test(code)) {
            return null;
          }
          const result = transformNamespaceImport(code);
          return {
            contents: result.code,
            loader: "js",
          };
        }
      );
    },
  };
}

export { transformFiles } from './scripts'