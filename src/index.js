'use strict'
const P = require('parsimmon')

function Token(str) {
  return P.string(str)
}
const lbrace = Token('{');
const rbrace = Token('}');
const lbracket = Token('[');
const rbracket = Token(']');
const comma = Token(',');
const colon = Token(':');
const indent = Token('  ')
const identifier = P.regex(/[a-z]/).many().map((x) => {
  return {
    identifier: x.join('')
  };
})
const linebreak = P.string("\r\n").or(P.string("\n")).or(P.string("\r"))
const expression = identifier
const nullReject = (r) => r.filter((x) => x != null)
const Block = P.seq(P.optWhitespace.map(() => null), P.seq(expression, linebreak.map(() => null)).map(nullReject).many().map((r) => r[0]), P.eof).map(nullReject)
const x = P.lazy((f) => {
  return Block;
})

console.log(JSON.stringify(x.parse(`
abcdefghijk
xxxx
`)))