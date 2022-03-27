import { readFile, createWriteStream } from "fs"
import glob from "glob"
import { relative } from "path"
import { isCjsFile, generateTransformer } from "./utils/base"
import { cjs2esmVisitors } from "./visitors"

const transformFileBase = generateTransformer(cjs2esmVisitors)
const ROOT = process.cwd()

function _transformFiles(pattern) {
  glob(pattern, {}, (err, files) => {
    if (err) {
      console.error(err)
    } else {
      files &&
        files.forEach((file) => {
          const filename = relative(ROOT, file)
          readFile(filename, (err, content) => {
            if (content && isCjsFile(content.toString())) {
              const str = content.toString()
              const { code } = transformFileBase(str)
              createWriteStream(filename).write(code)
            }
          })
        })
    }
  })
}

export function transformFiles(paths: string | string[]) {
  if (Array.isArray(paths)) {
    paths.forEach((v) => _transformFiles(v))
  } else {
    _transformFiles(paths)
  }
}

export function transformFile(path) {
  const filename = relative(ROOT, path)
  readFile(filename, (err, content) => {
    if (content && isCjsFile(content.toString())) {
      const str = content.toString()
      const { code } = transformFileBase(str)
      createWriteStream(filename).write(code)
    }
  })
}
