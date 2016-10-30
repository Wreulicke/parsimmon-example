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

const flat = (func) => (args) => func.apply(null, args)
const all = function () {
  return Promise.all(arguments)
}

const isYaml = (f) => path.basename(f, '.yaml').indexOf('.') === -1
const getJson = (yaml) => path.resolve(path.dirname(yaml), path.basename(yaml, '.yaml') + '.json')

describe("yaml parser test", () => {
  const dir = './test/case'
  const yamls = fs.readdirSync(dir)
    .filter(isYaml)
    .map((f) => path.join(dir, f))

  yamls.forEach((yaml) => {
    it(`test case : ${path.basename(yaml)}`, () =>
      all(toPromise(fs.readFile, yaml), toPromise(fs.readFile, getJson(yaml)))
      .then(flat((yaml, json) => {
        const result= parser.parse(yaml.toString()),actual =result.value
        const expected = JSON.parse(json.toString())
        const message=JSON.stringify(result)
        assert.deepEqual(expected, actual, message)
      }))
    )
  })
})