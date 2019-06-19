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

  // // Flush composed data
  // serverService.apiRouter.use((req, res, done) => {
  //   if (res.locals.__data)
  //     return res.success(res.locals.__data)
  //   // done(new HttpError(HttpError.NOT_FOUND))
  // })

  // // Catch and flush error
  // serverService.apiRouter.use((err, req, res, next) => {
  //   // Convert other errors to local error
  //   if (err instanceof BaseError) {
  //     res.error(err)
  //   } else {
  //     let errCode = mapErrNameCode[err.name]
  //     // Only log unknown errors
  //     if (!errCode) {
  //       // Log to file on production
  //       logger.error(err.message)
  //     }
  //     res.error(
  //       new InternalError(errCode || InternalError.DEFAULT),
  //       err
  //     )
  //   }
  // })

}