import express from 'express'
import http, { IncomingMessage } from 'http'
import _defaultsDeep from 'lodash.defaultsdeep'
import debug from 'debug'
import { AppError } from './error'

import './express/express'
import './express/response'

const prod = process.env.NODE_ENV === 'production'
const debugServer = debug('excore:server')
const debugRouter = debug('excore:router')

export default class Server {
  static service = '@server'

  config = {}
  defaults = {
    apiBaseUrl: '/api',
    port: 3000
  }

  constructor(provider, options) {
    this.core = provider.service('core')
    // Create app instances
    this.appRoot = express()
    this.http = http.Server(this.appRoot)
    this.appApi = express()
    // Attach provider to apps
    this.appRoot.$provider = provider
    this.appApi.$provider = provider
    // Apply configs
    this.config = _defaultsDeep({},
      typeof options === 'function' ? options(this) : options,
      this.defaults)

    // First middleware. Attach scoped provider.
    this.appRoot.use((req, res, next) => {
      debugRouter(req.method + ' ' + req.url)
      // Attache new scoped provider
      req.provider = this.core.createProvider()
      next()
    })
    debugServer('created')
  }

  // Invoked after configure
  listen() {
    debugServer('starting http')

    // Infuse di container to request
    this.appRoot.use(this.core.init(IncomingMessage.prototype))

    // Attach primary routers
    this.appRoot.use(this.config.apiBaseUrl, this.appApi)

    // Last middleware
    this.appApi.use((req, res) => {
      res.jsonError().notFound('Route not found')
    })

    // Catch and flush error for API
    // eslint-disable-next-line no-unused-vars
    this.appApi.use((err, req, res, next) => {
      if (err instanceof AppError) {
        return err.send(res)
      }
      res.jsonError().internal(prod ? null : err.message)
      debugServer('error', err)
    })

    const listenServer = () => {
      return new Promise((resolve, reject) => {
        const port = this.config.port
        this.http.listen(port, err => {
          if (err) return reject(err)
          debugServer('started at port %d', port)
          resolve()
        })
      })
    }

    return Promise.resolve().then(listenServer)
  }

}