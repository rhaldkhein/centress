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
          debugCtrl('file ...%s', file.substr(file.length - 24))
        })
    })
    debugCtrl('done')
  }

  _register(c) {
    // single file
    let apiBase
    let pageBase

    // console.log(c.classes)
    console.log(c.methods)

    // if (c.classes.api) apiBase = '/' + c.classes.api[0].args[0]
    // else if (c.classes.page) pageBase = '/' + c.classes.page[0].args[0]

    // let middlewares = []
    // if (c.classes.authorize) {
    //   middlewares.push(
    //     this.auth.authenticate(
    //       c.classes.authorize[0].args[0],
    //       c.classes.authorize[0].args[1]
    //     )
    //   )
    // }

    // if (apiBase) {
    //   _httpMethods.forEach(
    //     method => this._addToRouter(
    //       this.server.apiRouter,
    //       c.methods,
    //       method,
    //       apiBase,
    //       middlewares.filter(v => v)
    //     ))
    // } else if (pageBase) {
    //   _httpMethods.forEach(
    //     method => this._addToRouter(
    //       this.server.pageRouter,
    //       c.methods,
    //       method,
    //       pageBase,
    //       middlewares.filter(v => v)
    //     ))
    // }

  }

  _addToRouter(router, methods, httpMethod, baseUrl, middlewares) {
    (methods[httpMethod] || []).forEach(target => {
      // if (methods.authorize_disable) {
      //   console.log(
      //     methods.authorize_disable[0].descriptor.value
      //   );
      // }
      const args = [...middlewares]
      args.unshift(baseUrl + '/' + target.args[0])
      args.push(target.descriptor.value)
      router[httpMethod].apply(router, args)
      debugCtrl('rout ...%s', baseUrl + '/' + target.args[0])
    })
  }

}