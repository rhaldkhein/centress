import glob from 'glob'
import debug from 'debug'
import { init } from './decorators'
import './express'
import 'reflect-metadata'

const debugCtrl = debug('excore:controller')

export default class Controller {
  static service = '@controller'

  constructor(provider) {
    const serverService = provider.getService('@server')
    init(
      serverService.server,
      serverService.apiRouter,
      serverService.pageRouter
    )
    debugCtrl('created')
  }

  mountPaths(paths) {
    paths.forEach(path => {
      glob
        .sync(path + '/**/*.js')
        .forEach(file => require(file))
    })
    debugCtrl('mounted')
  }

}