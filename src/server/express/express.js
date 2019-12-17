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
  if (res && res.then) return res.then(() => baseRouter.use(baseUrl, router))
  baseRouter.use(baseUrl, router)
  return Promise.resolve()
}

app.useServiceRoutes = function (options = {}) {
  debugServer('using service routes')
  const serverService = this.$provider.service('@server')
  const collection = this.$provider.service('core').collection
  // Apply filters
  const { includes, excludes } = options
  let { services } = collection
  if (includes)
    services = services.filter(s => includes.indexOf(s.name) > -1)
  if (excludes)
    services = services.filter(s => !(excludes.indexOf(s.name) > -1))
  // Start applying router
  let promises = []
  for (let i = 0; i < services.length; i++) {
    const { name, type, value } = services[i]
    if (type === collection.types.SINGLETON) {
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