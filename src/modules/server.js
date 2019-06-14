import express from 'express'
import http from 'http'

export default class Server {
  static service = '@server'

  _app = express()
  _api = express.Router()
  _router = express.Router()
  _server = null
  _master = null
  _serverConfig = null
  _configService = null

  constructor(provider, master) {
    this._configService = provider.getRequiredService('@config')
    this._master = master
    this._server = http.Server(this._app)
    const config = this._configService.get('@server')
    this._serverConfig = config
    this._app.use(config.apiBaseUrl, this._api)
    this._app.use(this._router)
    const expressSettings = config.express
    for (let key in expressSettings)
      this._app.set(key, expressSettings[key])
  }

  start() {

    const setupRouters = () => {
      const { _services, getter } = this._master
      for (const key in _services) {
        if (!_services.hasOwnProperty(key)) continue
        const service = _services[key]
        const apiMethod = service.api
        const pageMethod = service.page
        const instance = getter.getRequiredService(key)
        const config = this._configService.get(key)
        if (apiMethod) {
          const apiRouter = express.Router()
          apiMethod.call(instance, apiRouter, getter, config)
          this._api.use(config.baseUrl, apiRouter)
        }
        if (pageMethod) {
          const pageRouter = express.Router()
          pageMethod.call(instance, pageRouter, getter, config)
          this._api.use(config.baseUrl, pageRouter)
        }
      }
    }

    const listenServer = () => {
      return new Promise((resolve, reject) => {
        const port = this._serverConfig.port
        this._server.listen(port, err => {
          if (err) return reject(err)
          resolve()
        })
      })
    }

    return Promise.resolve()
      .then(setupRouters)
      .then(listenServer)
  }

}