import path from 'path'
import callsite from 'callsite'
import express from 'express'
import BaseBuilder from 'jservice'

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
    const serverService = this.provider.service('@server')
    // Configure server
    if (typeof configure === 'function')
      configure(serverService.server)
    return this
  }

  _configureDefaultServices(services) {
    services.singleton(Util)
    services.singleton(Config)
    services.singleton(Authentication)
    services.singleton(Controller)
    services.singleton(Server, provider => {
      return provider.service('@config').get('server')
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