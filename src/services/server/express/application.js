import express, { application } from 'express'
import debug from 'debug'

const debugServer = debug('excore:server')

application.useConfig = function (config) {
  debugServer('using configuration')
  const configService = this.$provider.getService('$config')
  configService._set(config)
  this.$provider._setConfigService(configService)
}

application.useServiceRoutes = function () {
  debugServer('using service routes')
  const coreService = this.$provider.getService('$core')
  const serverService = this.$provider.getService('$server')
  const services = coreService.collection.services
  const provider = this.$provider
  services.forEach(Service => {
    if (Service.isSingleton) {
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