'use strict'
const assert = require('power-assert')
const parser = require('../src/yaml.js')
const fs = require('fs')
const path = require('path')
const toPromise=function(f){
  const args=Array.prototype.slice.call(arguments, 1)
  return new Promise((resolve, reject)=>{
    f.apply(null, args.concat((e, data)=>{
      (e)?reject(e):resolve(data)
    }))
  })
}
describe("yaml parser test", () => {
  let yamls
  before(function (done) {
    yamls = []
    const dir = './test/case'
    toPromise(fs.readdir, dir).then(files=>{
      files.filter((f) => path.basename(f, '.yaml').indexOf('.') === -1).forEach((f) => yamls.push(path.join(dir, f)))
      done()
    }).catch(done)
  })

  it("sub test", (done)=>{
    Promise.all(yamls.map((yaml)=>
      toPromise(fs.readFile, yaml).then((data)=>{
        const json=path.resolve(path.dirname(yaml),path.basename(yaml,'.yaml')+'.json')
        return toPromise(fs.readFile, json).then((d)=>{
          const actual=parser.parse(data.toString()).value
          const expected=JSON.parse(d.toString())
          assert.deepEqual(actual, expected)
        })
      })
    )).then(()=>done()).catch(done)
    
  })
})