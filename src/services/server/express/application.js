import express, { application as app } from 'express'
import debug from 'debug'

const debugServer = debug('excore:server')

app.useServiceRoutes = function () {
  debugServer('using service routes')
  const serverService = this.$provider.getService('@server')
  const collection = this.$provider.getService('$core').collection
  const services = collection.services
  const provider = this.$provider
  services.forEach(Service => {
    if (Service.type === collection.types.SINGLETON) {
      let instance = provider.getService(Service.service)
      let baseUrl = instance.baseUrl || '/' + Service.service
      if (instance.api) {
        let apiRouter = express.Router()
        instance.api(apiRouter)
        serverService.apiRouter.use(baseUrl, apiRouter)
      }
      if (instance.page) {
        let pageRouter = express.Router()
        instance.page(pageRouter)
        serverService.pageRouter.use(baseUrl, pageRouter)
      }
    }
  })
}
