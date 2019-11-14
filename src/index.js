import path from 'path'
import callsite from 'callsite'
import express from 'express'
import BaseBuilder from 'jservice'

// Built-in services
import Config from './config/service'
import Server from './server/service'
import Controller from './controller/service'
import Authentication from './authentication/service'

class Builder extends BaseBuilder {

  path = null
  configureServices = null
  configureApp = null

  configure(configureServices, configureApp) {
    this.path = path.dirname(callsite()[1].getFileName())
    // Save configures
    this.configureServices = configureServices
    this.configureApp = configureApp
    return this
  }

  _configureDefaultServices(services) {
    services.singleton(Config)
    services.singleton(Authentication)
    services.singleton(Controller)
    services.singleton(Server)
    services.configure(Server, provider => {
      return provider.service('@config').get('server')
    })
  }

  start() {
    // Adding built-in services
    this._configureDefaultServices(this.collection)
    // Run registry after all built-in services have been added
    super.build(this.configureServices)
    return super.start()
  }

}

function core() {
  return new Builder()
}

Object.assign(core, {
  // Functions
  express,
  // Services
  Server,
  Controller,
  Authentication,
  Config
})

export default core