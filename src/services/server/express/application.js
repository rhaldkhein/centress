import express, { application } from 'express'

application.useConfig = function (config) {
  const configService = this.$provider.getService('$config')
  configService._set(config)
  this.$provider._setConfigService(configService)
}

application.useServiceRoutes = function () {
  const coreService = this.$provider.getService('$core')
  const serverService = this.$provider.getService('$server')
  const services = coreService.collection.services
  const provider = coreService.provider
  for (let key in services) {
    if (!services.hasOwnProperty(key)) continue
    let service = services[key]
    if (service.isSingleton) {
      let instance = provider.getService(key)
      let baseUrl = instance.baseUrl || '/' + key
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
  }
}