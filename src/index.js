import path from 'path'
import express from 'express'
import callsite from 'callsite'
import { Builder as BaseBuilder } from 'jservice'
import Config from './services/config'
import Server from './services/server'

class Builder extends BaseBuilder {

  path = null
  configService = null

  build(configureServices, configure) {
    this.path = path.dirname(callsite()[1].getFileName())
    // Adding built-in services
    this._configureDefaultServices(this.collection)
    // Run registry after all built-in services have been added
    super.build(configureServices)
    // Initialize server
    const serverService = this.provider.getService('@server')
    serverService.init()
    // Configure server
    if (typeof configure === 'function')
      configure(serverService.app)
    return this
  }

  _configureDefaultServices(services) {
    services.addSingleton(Config)
    services.addSingleton(Server, provider => {
      return provider.getRequired('@config').get('server')
    })
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