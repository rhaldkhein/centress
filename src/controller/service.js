import glob from 'glob'
import debug from 'debug'
import { _flush } from './decorators'
import './express'

const debugCtrl = debug('excore:controller')

export default class Controller {
  static service = '@controller'

  constructor(provider) {
    this.server = provider.service('@server')
    this.auth = provider.service('@authentication')
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
          this._addMethod(this.server.appApi, des, '/' + des.api[0])
        if (des.page)
          this._addMethod(this.server.appRoot, des, '/' + des.page[0])
      }
    }
  }

  _addMethod(router, des, baseUrl) {
    if (!baseUrl) return
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
    if (des.httpGet && des.httpGet[0])
      router.get(baseUrl + '/' + des.httpGet[0], mw, des.value)
    if (des.httpPost && des.httpPost[0])
      router.post(baseUrl + '/' + des.httpPost[0], mw, des.value)
    if (des.httpPut && des.httpPut[0])
      router.put(baseUrl + '/' + des.httpPut[0], mw, des.value)
    if (des.httpDelete && des.httpDelete[0])
      router.delete(baseUrl + '/' + des.httpDelete[0], mw, des.value)
    if (des.httpPatch && des.httpPatch[0])
      router.patch(baseUrl + '/' + des.httpPatch[0], mw, des.value)
  }

}