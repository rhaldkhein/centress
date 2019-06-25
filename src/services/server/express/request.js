import { request } from 'express'

request.getService = function (service) {
  return this.provider.getService(service)
}

request.getRequiredService = function (service) {
  return this.provider.getRequiredService(service)
}