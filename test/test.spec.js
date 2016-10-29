'use strict'
const assert = require('power-assert')
const parser = require('../src/yaml.js')
const fs = require('fs')
const path = require('path')
const toPromise = function (f) {
  const args = Array.prototype.slice.call(arguments, 1)
  return new Promise((resolve, reject) => {
    f.apply(null, args.concat((e, data) => {
      (e) ? reject(e): resolve(data)
    }))
  })
}
describe("yaml parser test", () => {
  let yamls
  before(() => {
    const dir = './test/case'
    return toPromise(fs.readdir, dir).then(files => {
      yamls = []
      files.filter((f) => path.basename(f, '.yaml').indexOf('.') === -1).forEach((f) => yamls.push(path.join(dir, f)))
    })
  })

  it("sub test", () =>
    Promise.all(yamls.map((yaml) =>
      Promise.all([toPromise(fs.readFile, yaml), toPromise(fs.readFile, path.resolve(path.dirname(yaml), path.basename(yaml, '.yaml') + '.json'))])
      .then((r) => {
        const yaml = r[0], json = r[1]
        const actual = parser.parse(yaml.toString()).value
        const expected = JSON.parse(json.toString())
        assert.deepEqual(actual, expected)
      })
    ))
  )
})