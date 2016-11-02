'use strict'
const P = require('parsimmon')
const alt = P.alt
const string = P.string
const space = P.regex(/ */)
const indent = (n, parser) => (n === 0) ? parser : string('  '.repeat(n)).then(parser)
const identifier = P.regex(/[a-z]+/i)
const linebreak = P.regex(/\r?\n/)

const nest = (n) => linebreak.chain((r) => yaml(n + 1))
const node = (n) => P.seq(
  identifier.skip(P.optWhitespace),
  string(':').then(space).then(alt(nest(n), identifier)),
  linebreak.atLeast(0)
)

const yaml = (n) =>
  indent(n,
    alt(space.skip(linebreak),
      linebreak,
      node(n).map((v) => {
        return {
          key: v[0],
          value: v[1]
        }
      })
    )
  )
  .many()
  .map((v) =>
    v.filter((r) => r.key).reduce((res, arr) => {
      return res[arr.key] = arr.value, res
    }, {})
  )

const parser = P.lazy(() => yaml(0))

module.exports = parser