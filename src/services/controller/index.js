import glob from 'glob'
import debug from 'debug'
import { _flush, _httpMethods } from './decorators'
import './express'

const debugCtrl = debug('excore:controller')

export default class Controller {
  static service = '@controller'

  _methods = ['get', 'put']

  constructor(provider) {
    this.server = provider.getService('@server')
    this.auth = provider.getService('@authentication')
    // serverService.server
    // serverService.apiRouter
    // serverService.pageRouter
    debugCtrl('created')
  }

  mountPaths(paths) {
    paths.forEach(path => {
      glob
        .sync(path + '/**/*.js')
        .forEach(file => {
          require(file)
          this._register(_flush())
          debugCtrl('load ...%s', file.substr(file.length - 24))
        })
    })
    debugCtrl('done')
  }

  _register(c) {
    // single file
    let apiBase
    let pageBase

    if (c.classes.api) apiBase = '/' + c.classes.api[0].args[0]
    else if (c.classes.page) pageBase = '/' + c.classes.page[0].args[0]

    if (apiBase) {
      _httpMethods.forEach(
        method => this._addToRouter(
          this.server.apiRouter, c.methods, method, apiBase))
    } else if (pageBase) {
      _httpMethods.forEach(
        method => this._addToRouter(
          this.server.pageRouter, c.methods, method, pageBase))
    }

    if (c.classes.authorize) {
      // this.auth.authenticate(c.classes.authorize[0].args[0])
    }

  }

  _addToRouter(router, methods, httpMethod, baseUrl) {
    (methods[httpMethod] || []).forEach(target => {
      router[httpMethod](
        baseUrl + '/' + target.args[0],
        target.descriptor.value
      )
      debugCtrl('rout ...%s', baseUrl + '/' + target.args[0])
    })
  }

}