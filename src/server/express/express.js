import express, { application as app } from 'express'
import debug from 'debug'
const debugServer = debug('excore:server')

if (
  'useApi' in app ||
  'useApiRoutes' in app ||
  'useServiceRoutes' in app
) throw new Error('Not compatible with express')

function applyRouter(baseRouter, targetFn, baseUrl, provider, name) {
  const router = express.Router()
  const res = targetFn(router, provider, { name })
  if (res.then) return res.then(() => baseRouter.use(baseUrl, router))
  baseRouter.use(baseUrl, router)
}

app.useServiceRoutes = function (options = {}) {
  debugServer('using service routes')
  const serverService = this.$provider.service('@server')
  const collection = this.$provider.service('core').collection
  const services = collection.services
  const excludes = options.excludes || []
  let promises = []
  for (let i = 0; i < services.length; i++) {
    const service = services[i]
    const { name, type, value } = service
    if (type === collection.types.SINGLETON) {
      // Exclude specified services
      if (excludes.indexOf(name) > -1) continue
      // Apply routers to services
      const baseUrl = value.baseUrl || '/' + name
      const prom = Promise.resolve(value)
        .then(value => {
          if (!value.api) return value
          return applyRouter(
            serverService.appApi,
            value.api,
            baseUrl,
            this.$provider,
            name).then(() => value)
        }).then(value => {
          if (!value.page) return value
          return applyRouter(
            serverService.appRoot,
            value.page,
            baseUrl,
            this.$provider,
            name).then(() => value)
        })
      promises.push(prom)
    }
  }
  return Promise.all(promises)
}

app.useApi = function (config) {
  const serverService = this.$provider.service('@server')
  config(serverService.appApi)
}

app.useApiRoutes = function () {
  const serverService = this.$provider.service('@server')
  serverService.attachApiRoutes()
}