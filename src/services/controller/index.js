import glob from 'glob'
import debug from 'debug'
import { _flush } from './decorators'
import './express'

const debugCtrl = debug('excore:controller')

export default class Controller {
  static service = '@controller'

  _methods = ['get', 'put']

  constructor(provider) {
    this.server = provider.getService('@server')
    this.auth = provider.getService('@authentication')
    debugCtrl('created')
  }

  mountPaths(paths) {
    paths.forEach(path => {
      glob
        .sync(path + '/**/*.js')
        .forEach(file => {
          require(file)
          this._register(_flush())
          debugCtrl('file ...%s', file.substr(file.length - 24))
        })
    })
    debugCtrl('done')
  }

  _register({ methods }) {
    for (const key in methods) {
      if (methods.hasOwnProperty(key)) {
        const des = methods[key]
        if (des.api)
          this._addMethod(this.server.apiRouter, des, '/' + des.api[0])
        if (des.page)
          this._addMethod(this.server.pageRouter, des, '/' + des.page[0])
      }
    }
  }

  _addMethod(router, des, baseUrl) {
    let mw = [] // middlewares
    // Add authentication
    if (des.auth) {
      if (des.authMethod) {
        if (des.authMethod[0] !== false)
          mw.push(this.auth.authorize(
            des.authMethod[0], des.authMethod[1], des.authMethod[2]))
      } else {
        mw.push(this.auth.authorize(des.auth[0],
          des.auth[1], des.auth[2]))
      }
    }
    // Add middlewares
    if (des.httpGet)
      router.get(baseUrl + '/' + des.httpGet[0], mw, des.value)
    if (des.httpPost)
      router.post(baseUrl + '/' + des.httpPost[0], mw, des.value)
    if (des.httpPut)
      router.put(baseUrl + '/' + des.httpPut[0], mw, des.value)
    if (des.httpDelete)
      router.delete(baseUrl + '/' + des.httpDelete[0], mw, des.value)
    if (des.httpPatch)
      router.patch(baseUrl + '/' + des.httpPatch[0], mw, des.value)
  }

}