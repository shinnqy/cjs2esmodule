import * as t from '@babel/types'
import { getName } from '../utils/get'

export function replaceWithProp(ctr, path) {
  // const cmp = require('react').Component
  // ctr.id.name: cmp
  // ctr.init.property.name: Component
  // ctr.init.object.arguments[0].name: react
  if (getName(ctr, `init.object.callee`) === 'require') {
    path.replaceWith(
      t.importDeclaration(
        [
          t.importSpecifier(ctr.id, ctr.init.property),
        ],
        // source StringLiteral
        ctr.init.object.arguments[0]
      )
    )
  }
}

export function replaceWithDefault(ctr, path) {
  // const react1 = require('react')
  // ctr.id.name: react1
  // ctr.init.object.arguments[0].name: react
  if (getName(ctr, `init.callee`) === 'require') {
    path.replaceWith(
      t.importDeclaration(
        [
          t.importDefaultSpecifier(ctr.id),
        ],
        // source StringLiteral
        ctr.init.arguments[0]
      )
    )
  }
}

export function replaceWithRest(ctr, path) {
  // const { react: react1 } = require('react')

  if (ctr.init.callee.name === 'require') {
    path.replaceWith(
      t.importDeclaration(
        ctr.id.properties.map(v => t.importSpecifier(v.value, v.key)),
        // source StringLiteral
        ctr.init.arguments[0]
      )
    )
  }
}

export function replaceWithRequire(path) {
  // require('react')
  if (path.node.callee.name === 'require') {
    path.parentPath.replaceWith(
      t.importDeclaration(
        [],
        // source StringLiteral
        path.node.arguments[0]
      )
    )
  }
}