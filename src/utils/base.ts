import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

export const generateTransformer = visitors => (src) => {
  try {
    const ast = parser.parse(src);
    traverse(ast, visitors);

    return generate(ast);
  } catch (err) {
    // sourceType 默认为 script，如果报错，则用 module 解析
    const ast = parser.parse(src, { sourceType: "module" });
    traverse(ast, visitors);

    return generate(ast);
  }
}

export function isCjsFile(content) {
  return /(exports[\.\[]|module\.exports|require\()/g.test(content)
}
