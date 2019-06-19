import _defaultsDeep from 'lodash.defaultsdeep'
import logger from 'debug'
import express from 'express'
import http from 'http'

import './express/application'
import './express/response'

const debug = logger('excore:server')

export default class Server {

  static service = '$server'

  defaults = {
    apiBaseUrl: '/api',
    port: 3000
  }

  constructor(provider) {
    this.core = provider.getService('$core')
    this.app = express()
    this.server = http.Server(this.app)
    this.apiRouter = express.Router()
    this.pageRouter = express.Router()
    this.app.$provider = provider
    debug('Server created')
  }

  listen(config) {
    config = _defaultsDeep({}, config, this.defaults)

    this.app.use(config.apiBaseUrl, this.apiRouter)
    this.app.use(this.pageRouter)

    const setupRouters = () => {

    }

    const listenServer = () => {
      return new Promise((resolve, reject) => {
        const port = config.port
        this.server.listen(port, err => {
          if (err) return reject(err)
          debug('Server started at port %d', port)
          resolve()
        })
      })
    }

    return Promise.resolve()
      .then(setupRouters)
      .then(listenServer)
  }

  static start(provider) {
    const config = provider.getService('$config')
    const server = provider.getService('$server')
    return server.listen(config.get('$server'))
  }

}