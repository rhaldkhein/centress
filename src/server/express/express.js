import express, { application as app } from 'express'
import debug from 'debug'

const debugServer = debug('excore:server')

if (
  app.useServiceRoutes
  || app.useApi
)
  throw new Error('Not compatible with express')

app.useServiceRoutes = function () {
  debugServer('using service routes')
  const serverService = this.$provider.service('@server')
  const collection = this.$provider.service('__core__').collection
  const services = collection.services
  services.forEach(Service => {
    if (Service.type === collection.types.SINGLETON) {
      let baseUrl = Service.baseUrl || '/' + Service.service
      if (Service.api) {
        let appApi = express.Router()
        Service.api(appApi)
        serverService.appApi.use(baseUrl, appApi)
      }
      if (Service.page) {
        let pageRouter = express.Router()
        Service.page(pageRouter)
        serverService.appRoot.use(baseUrl, pageRouter)
      }
    }
  })
}

app.useApi = function (config) {
  const serverService = this.$provider.service('@server')
  config(serverService.appApi)
}