// const _defaultsDeep = require('lodash.defaultsdeep')
const express = require('express')
const http = require('http')

const configDefault = {
  apiBaseUrl: '/api',
  port: 3000
}

function Server() {
  console.log('A')
  // this._configService = provider.getRequiredService('@config')
  // config = this._config = _defaultsDeep(config, configDefault)
  this._app = express()
  this._api = express.Router()
  this._router = express.Router()
  // this._master = master
  this._server = http.Server(this._app)
  // this._app.use(config.apiBaseUrl, this._api)
  this._app.use(this._router)
  // const expressSettings = config.express
  // for (let key in expressSettings)
  //   this._app.set(key, expressSettings[key])
}

Server.prototype.listen = function () {
  console.log('B')
  // const setupRouters = () => {
  //   const { services, getter } = this._master
  //   for (const key in services) {
  //     if (!services.hasOwnProperty(key)) continue
  //     const service = services[key]
  //     const apiMethod = service.api
  //     const pageMethod = service.page
  //     const instance = getter.getRequiredService(key)
  //     const config = this._configService.get(key)
  //     if (apiMethod) {
  //       const apiRouter = express.Router()
  //       apiMethod.call(instance, apiRouter, getter, config)
  //       this._api.use(config.baseUrl, apiRouter)
  //     }
  //     if (pageMethod) {
  //       const pageRouter = express.Router()
  //       pageMethod.call(instance, pageRouter, getter, config)
  //       this._api.use(config.baseUrl, pageRouter)
  //     }
  //   }
  // }

  // const listenServer = () => {
  // return new Promise((resolve, reject) => {
  //   const port = this._config.port
  //   this._server.listen(port, err => {
  //     if (err) return reject(err)
  //     console.log(`Server started at port ${port}`);
  //     resolve()
  //   })
  // })
  // }

  // return Promise.resolve()
  //   .then(setupRouters)
  //   .then(listenServer)
}

Server.service = '@server'

Server.start = function (provider) {
  console.log('C')
}

Server.ready = function () {
  // body
  console.log('D')
}

module.exports = Server