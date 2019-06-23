import glob from 'glob'
import debug from 'debug'
import { init } from './decorators'
import './express'

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
      glob(path + '/**/*.js', function (er, files) {
        files.forEach(file => {
          require(file)
        })
      })
    })
    debugCtrl('mounted')
  }

  static start() {
    debugCtrl('start')
  }

}