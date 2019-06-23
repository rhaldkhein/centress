import _defaultsDeep from 'lodash.defaultsdeep'
import debug from 'debug'
import express from 'express'
import http from 'http'
import HttpError from './error'

import './express/application'
import './express/response'

const prod = process.env.NODE_ENV === 'production'
const debugServer = debug('excore:server')
const debugRouter = debug('excore:router')

export default class Server {
  static service = '@server'

  config = null
  defaults = {
    apiBaseUrl: '/api',
    port: 3000
  }

  constructor(provider, options) {
    this.core = provider.getService('$core')
    this.app = express()
    this.server = http.Server(this.app)
    this.apiRouter = express.Router()
    this.pageRouter = express.Router()
    this.app.$provider = provider
    this.config = _defaultsDeep({}, options, this.defaults)
    debugServer('created')
  }

  // Invoked before configure
  init() {
    debugServer('preparing')
    // First middleware. Attach scoped provider.
    this.app.use((req, res, next) => {
      debugRouter(req.url)
      // Attache new scoped provider
      req.provider = this.core.createScopedProvider()
      next()
    })
  }

  // Invoked after configure
  listen() {
    debugServer('starting http')

    this.app.use(this.config.apiBaseUrl, this.apiRouter)
    this.app.use(this.pageRouter)

    // Last middleware
    this.apiRouter.use((req, res) => {
      res.jsonError().notFound()
    })

    // Catch and flush error
    // eslint-disable-next-line no-unused-vars
    this.apiRouter.use((err, req, res, next) => {
      if (err instanceof HttpError) return err.send()
      res.jsonError().internal(prod ? null : err.message)
      debugServer('error', err)
    })

    const listenServer = () => {
      return new Promise((resolve, reject) => {
        const port = this.config.port
        this.server.listen(port, err => {
          if (err) return reject(err)
          debugServer('started at port %d', port)
          resolve()
        })
      })
    }

    return Promise.resolve()
      .then(listenServer)
  }

  static start(provider) {
    const server = provider.getService('@server')
    return server.listen()
  }

}