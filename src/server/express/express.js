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
  const collection = this.$provider.service('core').collection
  const services = collection.services
  services.forEach(service => {
    if (service.type === collection.types.SINGLETON) {
      const { value } = service
      let baseUrl = value.baseUrl || '/' + service.name
      if (value.api) {
        let appApi = express.Router()
        value.api(appApi)
        serverService.appApi.use(baseUrl, appApi)
      }
      if (value.page) {
        let pageRouter = express.Router()
        value.page(pageRouter)
        serverService.appRoot.use(baseUrl, pageRouter)
      }
    }
  })
}

app.useApi = function (config) {
  const serverService = this.$provider.service('@server')
  config(serverService.appApi)
}