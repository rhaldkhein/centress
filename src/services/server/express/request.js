import { request } from 'express'

if (request.getService)
  throw new Error('Can\'t bind getService to request')

request.getService = function (service) {
  return this.provider.getService(service)
}

if (request.getRequiredService)
  throw new Error('Can\'t bind getRequiredService to request')

request.getRequiredService = function (service) {
  return this.provider.getRequiredService(service)
}