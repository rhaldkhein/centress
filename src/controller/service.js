import debug from 'debug'
import glob from 'glob'
import path from 'path'
import _defaultsDeep from 'lodash.defaultsdeep'
import { _flush } from './decorators'
import './express'

const debugCtrl = debug('excore:controller')

export default class Controller {
  static service = '@controller'

  options = {
    paths: ['./controllers'],
    default: 'index',
    mapRoutes: []
  }

  constructor(provider) {
    this.core = provider.service('core')
    this.server = provider.service('@server')
    this.auth = provider.service('@authentication')
    debugCtrl('created')
  }

  setOptions(options) {
    this.options = _defaultsDeep(options, this.options)
  }

  mountControllers() {
    const paths = this.options.paths.map(p => path.resolve(this.core.path, p))
    paths.forEach(path => {
      glob.sync(path + '/**/*.js')
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
          this._addMethod(this.server.appApi, des, des.api[0])
        if (des.page)
          this._addMethod(this.server.appRoot, des, des.page[0])
      }
    }
  }

  _addMethod(router, des, ctrl) {
    if (!ctrl) return
    if (ctrl === this.options.default) ctrl = ''
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
      this._addHandler(router, 'get', ctrl, des.httpGet[0], mw, des.value)
    if (des.httpPost)
      this._addHandler(router, 'post', ctrl, des.httpPost[0], mw, des.value)
    if (des.httpPut)
      this._addHandler(router, 'put', ctrl, des.httpPut[0], mw, des.value)
    if (des.httpDelete)
      this._addHandler(router, 'delete', ctrl, des.httpDelete[0], mw, des.value)
    if (des.httpPatch)
      this._addHandler(router, 'patch', ctrl, des.httpPatch[0], mw, des.value)
  }

  /**
   * Do not register action if the controller is default as this will 
   * make the action to act like a controller.
   */
  _addHandler(router, method, ctrl, action, mw, value) {
    if (!action) return
    if (action === this.options.default) action = ''
    else if (!ctrl) return
    // Scan for mapped paths
    const destPath = '/' + ctrl + '/' + action
    router[method]([...this._getMapPaths(destPath), destPath], mw, value)
  }

  _getMapPaths(destPath) {
    for (let i = 0; i < this.options.mapRoutes.length; i++) {
      const item = this.options.mapRoutes[i]
      if (destPath === item[item.length - 1]) {
        const clonedItem = [...item]
        clonedItem.pop()
        return clonedItem
      }
    }
    return []
  }

}
