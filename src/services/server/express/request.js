import { request } from 'express'

if (request.getService)
  throw new Error('Can\'t bind getService')

request.getService = function (service) {
  return this.provider.getService(service)
}

if (request.getRequiredService)
  throw new Error('Can\'t bind getRequiredService')

request.getRequiredService = function (service) {
  return this.provider.getRequiredService(service)
}