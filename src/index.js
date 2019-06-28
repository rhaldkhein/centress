import path from 'path'
import callsite from 'callsite'
import express from 'express'
import { Builder as BaseBuilder } from 'jservice'

// Built-in services
import Util from './services/util'
import Config from './services/config'
import Server from './services/server'
import Controller from './services/controller'
import Authentication from './services/authentication'

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
    // Configure server
    if (typeof configure === 'function')
      configure(serverService.server)
    return this
  }

  _configureDefaultServices(services) {
    services.addSingleton(Util)
    services.addSingleton(Config)
    services.addSingleton(Authentication)
    services.addSingleton(Controller)
    services.addSingleton(Server, provider => {
      return provider.getRequired('@config').get('server')
    })
  }

}

function core() {
  return new Builder()
}

export default core
export * from 'express'
export {
  core,
  express
}