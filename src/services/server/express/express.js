import express, { application as app } from 'express'
import debug from 'debug'

const debugServer = debug('excore:server')

if (app.useServiceRoutes)
  throw new Error('Can\'t bind useServiceRoutes to express')

app.useServiceRoutes = function () {
  debugServer('using service routes')
  const serverService = this.$provider.service('@server')
  const collection = this.$provider.service('__core__').collection
  const services = collection.services
  services.forEach(Service => {
    if (Service.type === collection.types.SINGLETON) {
      let baseUrl = Service.baseUrl || '/' + Service.service
      if (Service.api) {
        let apiRouter = express.Router()
        Service.api(apiRouter)
        serverService.apiRouter.use(baseUrl, apiRouter)
      }
      if (Service.page) {
        let pageRouter = express.Router()
        Service.page(pageRouter)
        serverService.pageRouter.use(baseUrl, pageRouter)
      }
    }
  })
}
