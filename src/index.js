import path from 'path'
import express from 'express'
import callsite from 'callsite'
import { Builder as BaseBuilder } from 'jservice'
import Config from './services/config'
import Server from './services/server'
import Provider from './provider'

class Builder extends BaseBuilder {

  path = null
  provider = null
  configService = null

  build(registry, configure) {
    this.path = path.dirname(callsite()[1].getFileName())
    super.build(registry)
    // Adding built-in services
    this.collection.addSingleton(Config)
    this.collection.addSingleton(Server)
    // Create main singleton provider
    this.provider = this.createProvider()
    this.provider._isSingleton = true
    // Initializing config and server
    this.configService = this.provider.getService('$config')
    const serverService = this.provider.getService('$server')
    serverService.init()
    if (typeof configure === 'function') {
      configure(serverService.app)
    }
    return this
  }

  createProvider() {
    return new Provider(this.collection, this.configService)
  }

}

function core() {
  return new Builder()
}

export default core
export {
  core,
  express
}